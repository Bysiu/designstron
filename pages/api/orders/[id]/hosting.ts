import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { plan, domain, ssl, period } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (!plan || !domain) {
      return res.status(400).json({ error: 'Plan and domain are required' });
    }

    // Sprawdź czy zamówienie istnieje
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Oblicz datę wygaśnięcia
    const months = period || 1; // domyślnie 1 miesiąc
    let expiresAt: Date;
    
    if (order.hostingExpiresAt) {
      // Przedłuż od aktualnej daty wygaśnięcia
      expiresAt = new Date(order.hostingExpiresAt);
      expiresAt.setMonth(expiresAt.getMonth() + months);
    } else {
      // Jeśli nie ma daty wygaśnięcia, ustaw od teraz
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);
    }

    // Oblicz cenę
    const monthlyPrice = plan === 'premium' ? 400 : 200;
    const discount = period >= 12 ? 0.15 : period >= 6 ? 0.10 : period >= 3 ? 0.05 : 0;
    const hostingPrice = monthlyPrice * months * (1 - discount);
    const sslPrice = ssl ? 100 : 0;
    const totalPrice = hostingPrice + sslPrice;

    // Utwórz nowe zamówienie dla hostingu (przedłużenie)
    const hostingOrder = await prisma.order.create({
      data: {
        userId: order.userId,
        status: 'PENDING',
        totalAmount: totalPrice,
        nazwaFirmy: order.nazwaFirmy,
        hostingPlan: plan,
        domain,
        ssl: ssl || false,
        hostingExpiresAt: expiresAt,
        // Skopiuj dane kontaktowe z oryginalnego zamówienia
        customerPhone: order.customerPhone
      }
    });

    // Zaktualizuj datę wygaśnięcia w oryginalnym zamówieniu
    await prisma.order.update({
      where: { id: order.id },
      data: {
        hostingExpiresAt: expiresAt
      }
    });

    res.status(200).json({ 
      success: true, 
      order: hostingOrder,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error activating hosting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
