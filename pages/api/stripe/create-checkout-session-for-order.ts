import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
} as any);

function getBaseUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
  const protoHeader = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader)?.split(',')[0]?.trim();
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

  const base = envUrl || (host ? `${proto || 'http'}://${host}` : '');
  return base.replace(/\/$/, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Nieautoryzowany dostęp' });
  }

  try {
    const { orderId } = req.body as { orderId?: string };

    if (!orderId) {
      return res.status(400).json({ message: 'Brak orderId' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Zamówienie nie znalezione' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'To zamówienie nie oczekuje na płatność' });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: 'Brak emaila użytkownika' });
    }

    const baseUrl = getBaseUrl(req);
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: order.orderItems.map((item) => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          unit_amount: Math.round(Number(item.unitPrice) * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/zamowienie/anulowane`,
      metadata: {
        orderId: order.id,
      },
      customer_email: userEmail,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: stripeSession.id },
    });

    return res.status(200).json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Błąd tworzenia sesji Stripe dla istniejącego zamówienia:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
