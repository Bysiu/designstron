import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    // Sprawdzenie czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Użytkownik o tym emailu już istnieje" });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tworzenie użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
        role: "USER"
      }
    });

    res.status(201).json({ 
      message: "Użytkownik został pomyślnie zarejestrowany",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Błąd rejestracji:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
