import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;

    // Pobierz zamówienia użytkownika
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Pobierz wiadomości użytkownika
    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Oblicz statystyki
    const stats = {
      orders: orders.length,
      messages: messages.length,
      visits: Math.floor(Math.random() * 1000) + 500, // Przykładowe dane
      projects: orders.filter(o => o.status === 'IN_PROGRESS').length
    };

    // Formatuj ostatnie zamówienia
    const recentOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: order.orderItems
    }));

    res.status(200).json({
      ...stats,
      recentOrders
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
