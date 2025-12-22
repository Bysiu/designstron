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

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.orderId) {
          // Aktualizacja statusu zamówienia
          await prisma.order.update({
            where: { id: session.metadata.orderId },
            data: { 
              status: "PAID",
              statusHistory: {
                create: {
                  status: "PAID",
                  comment: "Płatność pomyślnie zakończona",
                },
              },
            },
          });
        }
        break;

      case "checkout.session.expired":
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        
        if (expiredSession.metadata?.orderId) {
          await prisma.order.update({
            where: { id: expiredSession.metadata.orderId },
            data: { 
              status: "CANCELLED",
              statusHistory: {
                create: {
                  status: "CANCELLED",
                  comment: "Sesja płatności wygasła",
                },
              },
            },
          });
        }
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", failedPayment.id);
        break;

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", subscription.id);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", deletedSubscription.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Błąd obsługi webhooka:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
