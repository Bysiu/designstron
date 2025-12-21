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

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status jest wymagany" });
    }

    // Aktualizacja statusu zamówienia
    const order = await prisma.order.update({
      where: { id: id as string },
      data: { 
        status,
        statusHistory: {
          create: {
            status,
            comment: comment || `Status zmieniony na: ${status}`,
          },
        },
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

    res.status(200).json(order);
  } catch (error) {
    console.error("Błąd aktualizacji statusu:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
