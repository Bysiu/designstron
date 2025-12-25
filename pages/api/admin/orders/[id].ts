import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Brak uprawnień administratora' });
  }

  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: true,
        statusHistory: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Zamówienie nie znalezione' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Błąd pobierania zamówienia admin:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
