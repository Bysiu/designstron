import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, subject, message, userId } = req.body;

    // Walidacja podstawowych pól
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: "Brakujące wymagane pola: name, email, subject, message" 
      });
    }

    // Walidacja formatu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Nieprawidłowy format email" });
    }

    // Tworzenie formularza kontaktowego
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        userId: userId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    console.log(`Nowy formularz kontaktowy: ${contactForm.id} od ${contactForm.email}`);
    if (contactForm.userId) {
      console.log(`Formularz przypisany do użytkownika: ${contactForm.userId}`);
    }

    res.status(201).json({ 
      message: "Formularz został wysłany pomyślnie",
      contactForm: {
        id: contactForm.id,
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        status: contactForm.status,
        createdAt: contactForm.createdAt,
        user: contactForm.user
      }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia formularza kontaktowego:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
