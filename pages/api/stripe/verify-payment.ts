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
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Nieautoryzowany dostęp" });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({ message: "Brak ID sesji" });
    }

    // Pobranie sesji Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!stripeSession) {
      return res.status(404).json({ message: "Sesja nie znaleziona" });
    }

    console.log('Stripe session metadata:', stripeSession.metadata);
    console.log('Stripe payment status:', stripeSession.payment_status);
    console.log('Stripe session ID:', stripeSession.id);

    // Pobranie zamówienia na podstawie metadata
    const order = await prisma.order.findUnique({
      where: { 
        id: stripeSession.metadata?.orderId as string 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Zamówienie nie znalezione" });
    }

    // Sprawdzenie czy zamówienie należy do zalogowanego użytkownika
    if (order.userId !== session.user.id) {
      return res.status(403).json({ message: "Brak dostępu do zamówienia" });
    }

    // Fallback: jeśli webhook nie dotarł, a Stripe pokazuje płatność jako opłaconą, zaktualizuj status w bazie
    const isPaid = stripeSession.payment_status === 'paid' || (stripeSession as any).status === 'complete';
    const isHostingExtend = stripeSession.metadata?.hostingExtend === 'true';
    
    console.log('Warunki:', { 
      isPaid, 
      isHostingExtend, 
      orderStatus: order.status, 
      orderStatusNotPaid: order.status !== 'PAID',
      shouldUpdate: isPaid && order.status !== 'PAID'
    });
    
    if (isPaid && order.status !== 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          statusHistory: {
            create: {
              status: 'PAID',
              comment: isHostingExtend ? 'Płatność za przedłużenie hostingu potwierdzona' : 'Płatność potwierdzona (verify-payment)'
            }
          }
        }
      });

      // Jeśli to przedłużenie hostingu, zaktualizuj datę wygaśnięcia w oryginalnym zamówieniu
      if (isHostingExtend && stripeSession.metadata?.originalOrderId) {
        const extendMonths = parseInt(stripeSession.metadata?.period || '1');
        
        console.log('Przedłużanie hostingu - ID oryginalnego zamówienia:', stripeSession.metadata?.originalOrderId);
        
        // Pobierz oryginalne zamówienie aby sprawdzić aktualną datę wygaśnięcia
        const originalOrder = await prisma.order.findUnique({
          where: { id: stripeSession.metadata?.originalOrderId || '' },
          select: { hostingExpiresAt: true, hostingPlan: true, status: true }
        });
        
        console.log('Oryginalne zamówienie:', originalOrder);
        
        if (originalOrder?.hostingExpiresAt) {
          // Przedłuż od aktualnej daty wygaśnięcia
          const newExpiresAt = new Date(originalOrder.hostingExpiresAt);
          newExpiresAt.setMonth(newExpiresAt.getMonth() + extendMonths);
          
          console.log('Przedłużanie od istniejącej daty:', originalOrder.hostingExpiresAt, 'do:', newExpiresAt);
          
          await prisma.order.update({
            where: { id: stripeSession.metadata?.originalOrderId || '' },
            data: {
              hostingExpiresAt: newExpiresAt
            }
          });
        } else {
          // Jeśli nie ma daty wygaśnięcia, ustaw od teraz
          const newExpiresAt = new Date();
          newExpiresAt.setMonth(newExpiresAt.getMonth() + extendMonths);
          
          console.log('Brak daty wygaśnięcia, ustawianie od teraz do:', newExpiresAt);
          
          await prisma.order.update({
            where: { id: stripeSession.metadata?.originalOrderId || '' },
            data: {
              hostingExpiresAt: newExpiresAt
            }
          });
        }
      }
    } else if (isPaid && isHostingExtend && order.status === 'PAID') {
      // Jeśli zamówienie jest już opłacone ale to przedłużenie hostingu, zaktualizuj datę wygaśnięcia
      console.log('Zamówienie już opłacone, aktualizuję hostingExpiresAt dla przedłużenia');
      
      // Sprawdź czy ta sesja już przetwarzała przedłużenie (uniknij wielokrotnego przedłużania)
      const existingHistory = await prisma.orderStatusHistory.findFirst({
        where: {
          orderId: stripeSession.metadata?.originalOrderId || '',
          comment: {
            contains: `session_id: ${session_id}`
          }
        }
      });
      
      if (existingHistory) {
        console.log('Przedłużenie dla tej sesji już zostało przetworzone');
        return res.status(200).json({
          orderId: order.id,
          amount: order.totalAmount,
          status: order.status,
          paymentStatus: stripeSession.payment_status,
          user: order.user,
          alreadyProcessed: true
        });
      }
      
      const extendMonths = parseInt(stripeSession.metadata?.period || '1');
      
      console.log('Przedłużanie hostingu - ID oryginalnego zamówienia:', stripeSession.metadata?.originalOrderId);
      console.log('Liczba miesięcy do przedłużenia:', extendMonths);
      console.log('Wartość z metadata:', stripeSession.metadata?.period);
      
      // Pobierz oryginalne zamówienie aby sprawdzić aktualną datę wygaśnięcia
      const originalOrder = await prisma.order.findUnique({
        where: { id: stripeSession.metadata?.originalOrderId || '' },
        select: { hostingExpiresAt: true, hostingPlan: true, status: true }
      });
      
      console.log('Oryginalne zamówienie (już PAID):', originalOrder);
      
      if (originalOrder?.hostingExpiresAt) {
        // Przedłuż od aktualnej daty wygaśnięcia
        const newExpiresAt = new Date(originalOrder.hostingExpiresAt);
        console.log('Data wygaśnięcia przed przedłużeniem:', originalOrder.hostingExpiresAt);
        console.log('Data wygaśnięcia po dodaniu miesięcy (przed setMonth):', newExpiresAt);
        newExpiresAt.setMonth(newExpiresAt.getMonth() + extendMonths);
        console.log('Data wygaśnięcia po przedłużeniu:', newExpiresAt);
        console.log('Różnica w miesiącach:', extendMonths);
        
        await prisma.order.update({
          where: { id: stripeSession.metadata?.originalOrderId || '' },
          data: {
            hostingExpiresAt: newExpiresAt
          }
        });
        
        // Dodaj wpis do historii o przedłużeniu hostingu
        await prisma.orderStatusHistory.create({
          data: {
            orderId: stripeSession.metadata?.originalOrderId || '',
            status: 'COMPLETED',
            comment: `Przedłużenie hostingu o ${extendMonths} miesięcy (session_id: ${session_id})`
          }
        });
      } else {
        // Jeśli nie ma daty wygaśnięcia, ustaw od teraz
        const newExpiresAt = new Date();
        newExpiresAt.setMonth(newExpiresAt.getMonth() + extendMonths);
        
        console.log('Brak daty wygaśnięcia (PAID), ustawianie od teraz do:', newExpiresAt);
        
        await prisma.order.update({
          where: { id: stripeSession.metadata?.originalOrderId || '' },
          data: {
            hostingExpiresAt: newExpiresAt
          }
        });
        
        // Dodaj wpis do historii o przedłużeniu hostingu
        await prisma.orderStatusHistory.create({
          data: {
            orderId: stripeSession.metadata?.originalOrderId || '',
            status: 'COMPLETED',
            comment: `Przedłużenie hostingu o ${extendMonths} miesięcy (session_id: ${session_id})`
          }
        });
      }
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      paymentStatus: stripeSession.payment_status,
      user: order.user
    });

  } catch (error) {
    console.error("Błąd weryfikacji płatności:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
