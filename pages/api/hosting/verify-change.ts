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
      return res.status(404).json({ error: "Zamówienie nie znalezione" });
    }

    // Sprawdzenie czy zamówienie należy do zalogowanego użytkownika
    if (order.userId !== session.user.id) {
      return res.status(403).json({ error: "Brak dostępu do zamówienia" });
    }

    // Sprawdzenie czy to płatność za zmianę planu hostingu
    const isHostingChange = stripeSession.metadata?.type === 'hosting_change';
    
    if (isHostingChange) {
      const fromPlan = stripeSession.metadata?.fromPlan as 'basic' | 'premium';
      const toPlan = stripeSession.metadata?.toPlan as 'basic' | 'premium';
      
      // Zaktualizuj zamówienie z nowym planem hostingu
      // Użyj oryginalnego ID zamówienia z metadata
      const originalOrderId = stripeSession.metadata?.originalOrderId || order.id;
      
      await prisma.order.update({
        where: { id: originalOrderId },
        data: {
          hostingPlan: toPlan,
          // SSL jest dodatkową płatną usługą, nie automatycznie w planie Premium
          statusHistory: {
            create: {
              status: 'COMPLETED',
              comment: `Zmiana planu hostingu z ${fromPlan === 'premium' ? 'Premium' : 'Basic'} na ${toPlan === 'premium' ? 'Premium' : 'Basic'}`
            }
          }
        }
      });
      
      return res.status(200).json({
        orderId: order.id,
        fromPlan,
        toPlan,
        amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : order.totalAmount,
        type: 'hosting_change'
      });
    }

    res.status(400).json({ error: "Nieprawidłowy typ płatności" });

  } catch (error) {
    console.error("Błąd weryfikacji zmiany hostingu:", error);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
}
