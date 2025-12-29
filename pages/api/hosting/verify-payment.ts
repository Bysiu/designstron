import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
} as any);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Nieautoryzowany dostęp" });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({ error: "Brak ID sesji" });
    }

    // Pobranie sesji Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!stripeSession) {
      return res.status(404).json({ error: "Sesja nie znaleziona" });
    }

    // Pobranie zamówienia na podstawie orderId z metadata
    const order = await prisma.order.findUnique({
      where: { 
        id: stripeSession.metadata?.orderId as string 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Zamówienie nie znalezione" });
    }

    // Sprawdzenie czy zamówienie należy do zalogowanego użytkownika
    if (order.userId !== session.user.id) {
      return res.status(403).json({ error: "Brak dostępu do zamówienia" });
    }

    // Sprawdzenie czy to płatność za hosting
    const isHostingPayment = stripeSession.metadata?.type === 'hosting';
    const isHostingChange = stripeSession.metadata?.type === 'hosting_change';
    const isHostingExtend = stripeSession.metadata?.type === 'hosting_extend';
    
    if (isHostingPayment) {
      const hostingPlan = stripeSession.metadata?.plan as 'basic' | 'premium';
      const hostingDuration = parseInt(stripeSession.metadata?.period || '12');
      
      // Oblicz datę wygaśnięcia hostingu
      const currentExpiry = order.hostingExpiresAt ? new Date(order.hostingExpiresAt) : new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + hostingDuration);
      
      // Utwórz nowe zamówienie dla hostingu
      const hostingOrder = await prisma.order.create({
        data: {
          userId: order.userId,
          totalAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
          status: 'COMPLETED',
          hostingPlan,
          hostingExpiresAt: newExpiry,
          domain: stripeSession.metadata?.domain || order.domain,
          ssl: stripeSession.metadata?.ssl === 'true',
          nazwaFirmy: order.nazwaFirmy,
          branża: order.branża,
          orderItems: {
            create: [
              {
                name: `Hosting ${hostingPlan === 'premium' ? 'Premium' : 'Basic'}`,
                description: `${hostingPlan === 'premium' ? 'Premium' : 'Basic'} hosting - ${hostingDuration} miesięcy`,
                quantity: 1,
                unitPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
                totalPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount
              },
              ...(stripeSession.metadata?.ssl === 'true' ? [{
                name: 'Certyfikat SSL',
                description: 'Certyfikat SSL - jednorazowa opłata',
                quantity: 1,
                unitPrice: 100,
                totalPrice: 100
              }] : [])
            ]
          },
          statusHistory: {
            create: {
              status: 'COMPLETED',
              comment: `Hosting ${hostingPlan === 'premium' ? 'Premium' : 'Basic'} aktywowany na ${hostingDuration} miesięcy`
            }
          }
        }
      });
      
      return res.status(200).json({
        orderId: hostingOrder.id,
        hostingPlan,
        amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
        hostingExpiresAt: newExpiry,
        type: 'hosting'
      });
    }
    
    if (isHostingChange) {
      const fromPlan = stripeSession.metadata?.fromPlan as 'basic' | 'premium';
      const toPlan = stripeSession.metadata?.toPlan as 'basic' | 'premium';
      
      // Utwórz nowe zamówienie dla zmiany planu
      const changeOrder = await prisma.order.create({
        data: {
          userId: order.userId,
          totalAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
          status: 'COMPLETED',
          hostingPlan: toPlan,
          hostingExpiresAt: order.hostingExpiresAt,
          domain: order.domain,
          ssl: order.ssl,
          nazwaFirmy: order.nazwaFirmy,
          branża: order.branża,
          orderItems: {
            create: [
              {
                name: `Upgrade hostingu z ${fromPlan === 'premium' ? 'Premium' : 'Basic'} na ${toPlan === 'premium' ? 'Premium' : 'Basic'}`,
                description: 'Upgrade planu hostingowego - dopłata za pozostałe miesiące',
                quantity: 1,
                unitPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
                totalPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount
              }
            ]
          },
          statusHistory: {
            create: {
              status: 'COMPLETED',
              comment: `Plan hostingu zmieniony z ${fromPlan === 'premium' ? 'Premium' : 'Basic'} na ${toPlan === 'premium' ? 'Premium' : 'Basic'}`
            }
          }
        }
      });
      
      return res.status(200).json({
        orderId: changeOrder.id,
        hostingPlan: toPlan,
        amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
        type: 'hosting_change'
      });
    }
    
    if (isHostingExtend) {
      const hostingPlan = stripeSession.metadata?.plan as 'basic' | 'premium';
      const extendDuration = parseInt(stripeSession.metadata?.period || '12');
      
      // Oblicz nową datę wygaśnięcia
      const currentExpiry = order.hostingExpiresAt ? new Date(order.hostingExpiresAt) : new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + extendDuration);
      
      // Utwórz nowe zamówienie dla przedłużenia hostingu
      const extendOrder = await prisma.order.create({
        data: {
          userId: order.userId,
          totalAmount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
          status: 'COMPLETED',
          hostingPlan,
          hostingExpiresAt: newExpiry,
          domain: order.domain,
          ssl: order.ssl,
          nazwaFirmy: order.nazwaFirmy,
          branża: order.branża,
          orderItems: {
            create: [
              {
                name: `Przedłużenie hostingu ${hostingPlan === 'premium' ? 'Premium' : 'Basic'}`,
                description: `Przedłużenie hostingu - ${extendDuration} miesięcy`,
                quantity: 1,
                unitPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
                totalPrice: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount
              }
            ]
          },
          statusHistory: {
            create: {
              status: 'COMPLETED',
              comment: `Hosting ${hostingPlan === 'premium' ? 'Premium' : 'Basic'} przedłużony o ${extendDuration} miesięcy`
            }
          }
        }
      });
      
      return res.status(200).json({
        orderId: extendOrder.id,
        hostingPlan,
        amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
        hostingExpiresAt: newExpiry,
        type: 'hosting_extend'
      });
    }

    // Fallback: jeśli webhook nie dotarł, a Stripe pokazuje płatność jako opłaconą, zaktualizuj status w bazie
    const isPaid = stripeSession.payment_status === 'paid' || (stripeSession as any).status === 'complete';
    if (isPaid && order.status !== 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          statusHistory: {
            create: {
              status: 'PAID',
              comment: 'Płatność potwierdzona (verify-payment)'
            }
          }
        }
      });
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      paymentStatus: stripeSession.payment_status,
      user: order.user
    });

  } catch (error) {
    console.error("Błąd weryfikacji płatności hostingu:", error);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
}
