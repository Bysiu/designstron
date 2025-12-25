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
    console.error("Błąd weryfikacji płatności:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
