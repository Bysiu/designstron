import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
} as any);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { orderItems, userEmail, totalAmount, customerPhone } = req.body;

    console.log('Received data:', { orderItems, userEmail, totalAmount, customerPhone });

    if (!orderItems || !userEmail || !totalAmount) {
      console.log('Missing data validation failed:', { orderItems: !!orderItems, userEmail: !!userEmail, totalAmount: !!totalAmount, totalAmountValue: totalAmount });
      return res.status(400).json({ message: "Brakujące dane" });
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.log('Invalid totalAmount:', totalAmount);
      return res.status(400).json({ message: "Nieprawidłowa kwota" });
    }

    // Znajdź użytkownika po email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const orderCreateData: any = {
      userId: user.id, // Używamy ID użytkownika
      totalAmount: totalAmount,
      customerPhone: customerPhone || null,
      status: "PENDING",
      orderItems: {
        create: orderItems.map((item: any) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
      statusHistory: {
        create: {
          status: "PENDING",
          comment: "Zamówienie utworzone, oczekuje na płatność",
        },
      },
    };

    // Tworzenie zamówienia w bazie danych
    const order = await prisma.order.create({
      data: orderCreateData,
    });

    // Tworzenie sesji checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      line_items: orderItems.map((item: any) => ({
        price_data: {
          currency: "pln",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.unitPrice * 100), // Stripe używa groszy
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/zamowienie/anulowane`,
      metadata: {
        orderId: order.id,
      },
      customer_email: userEmail,
    });

    // Aktualizacja zamówienia z ID płatności Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: session.id },
    });

    res.status(200).json({ sessionId: session.id, orderId: order.id });
  } catch (error) {
    console.error("Błąd tworzenia sesji Stripe:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
