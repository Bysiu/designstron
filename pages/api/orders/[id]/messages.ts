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

  if (req.method === "POST") {
    try {
      const { content, sender } = req.body;

      if (!content || !sender) {
        return res.status(400).json({ message: "Brakujące dane" });
      }

      // Sprawdzenie czy zamówienie należy do użytkownika
      const order = await prisma.order.findFirst({
        where: {
          id: id as string,
          userId: session.user.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Zamówienie nie znalezione" });
      }

      // Tylko użytkownicy mogą wysyłać wiadomości jako USER
      if (sender === 'USER' && session.user.role !== 'USER') {
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
      console.error("Błąd wysyłania wiadomości:", error);
      res.status(500).json({ message: "Wystąpił błąd serwera" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
