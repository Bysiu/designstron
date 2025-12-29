import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { session_id } = req.query;
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Znajdź zamówienie po session_id - użyj statusHistory do znalezienia ostatniej sesji
    const order = await prisma.order.findFirst({
      where: {
        user: {
          email: session.user.email
        },
        statusHistory: {
          some: {
            comment: {
              contains: session_id
            }
          }
        }
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
      return res.status(404).json({ error: 'Nie znaleziono zamówienia' });
    }

    // Zwróć szczegóły zamówienia
    return res.status(200).json({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      hostingPlan: order.hostingPlan,
      hostingExpiresAt: order.hostingExpiresAt,
      user: order.user
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
