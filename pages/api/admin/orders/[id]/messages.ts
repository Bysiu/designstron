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

  const { id } = req.query;

  if (req.method === "POST") {
    try {
      const { content, sender } = req.body;

      if (!content || !sender) {
        return res.status(400).json({ message: "Brakujące dane" });
      }

      // Sprawdzenie czy zamówienie istnieje
      const order = await prisma.order.findUnique({
        where: { id: id as string }
      });

      if (!order) {
        return res.status(404).json({ message: "Zamówienie nie znalezione" });
      }

      // Tylko admin może wysyłać wiadomości jako ADMIN
      if (sender === 'ADMIN' && session.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Brak uprawnień" });
      }

      const message = await prisma.message.create({
        data: {
          content,
          sender,
          userId: session.user.id,
          orderId: id as string
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

      res.status(201).json(message);
    } catch (error) {
      console.error("Błąd wysyłania wiadomości admin:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
