import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Nieautoryzowany dostęp" });
    }

    // Pobierz tylko zamówienia stron (z opisProjektu)
    const projects = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        opisProjektu: {
          not: null
        }
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
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Przekształć zamówienia na format projektów
    const formattedProjects = projects.map(order => ({
      id: order.id,
      name: order.nazwaFirmy || `Projekt #${order.id.slice(-8)}`,
      status: order.status,
      domain: order.domain,
      hostingPlan: order.hostingPlan,
      hostingExpiresAt: order.hostingExpiresAt,
      ssl: order.ssl,
      createdAt: order.createdAt,
      completedAt: order.statusHistory.find(h => h.status === 'COMPLETED')?.createdAt || null
    }));

    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Błąd pobierania projektów:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
