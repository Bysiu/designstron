import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Nieautoryzowany dostęp" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: id as string,
          userId: session.user.id
        },
        include: {
          orderItems: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          messages: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Zamówienie nie znalezione" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Błąd pobierania zamówienia:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
