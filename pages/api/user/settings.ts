import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Nieautoryzowany dostęp" });
  }

  try {
    const { name, email, currentPassword, newPassword } = req.body;

    // Pobranie aktualnego użytkownika
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    // Sprawdzenie czy email jest unikalny (jeśli zmieniany)
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({ message: "Użytkownik o tym emailu już istnieje" });
      }
    }

    // Jeśli zmiana hasła
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Obecne hasło jest wymagane do zmiany hasła" });
      }

      if (!user.password) {
        return res.status(400).json({ message: "Konto nie ma ustawionego hasła" });
      }

      // Weryfikacja obecnego hasła
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Nieprawidłowe obecne hasło" });
      }

      // Hashowanie nowego hasła
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Aktualizacja z nowym hasłem
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name || user.name,
          email: email || user.email,
          password: hashedNewPassword
        }
      });
    } else {
      // Aktualizacja bez zmiany hasła
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name || user.name,
          email: email || user.email
        }
      });
    }

    res.status(200).json({ message: "Ustawienia zostały zaktualizowane" });
  } catch (error) {
    console.error("Błąd aktualizacji ustawień:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
