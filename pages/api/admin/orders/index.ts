import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Brak uprawnień administratora" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { status } = req.query;
    
    const whereClause = status && status !== 'all' 
      ? { status: status as string }
      : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          select: {
            name: true,
            quantity: true,
            totalPrice: true
          }
        },
        messages: {
          select: {
            id: true,
            content: true,
            sender: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Błąd pobierania zamówień admin:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
