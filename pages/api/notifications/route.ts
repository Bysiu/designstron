import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Nieautoryzowany dostęp' }, { status: 401 });
    }

    // Tymczasowo zwracamy przykładowe dane, bo model notification nie istnieje w bazie
    const mockNotifications = [
      {
        id: '1',
        type: 'success',
        title: 'Zamówienie opłacone',
        message: 'Twoje zamówienie #123 zostało pomyślnie opłacone. Rozpoczynamy pracę!',
        timestamp: new Date().toISOString(),
        read: false,
        orderId: '123'
      },
      {
        id: '2',
        type: 'info',
        title: 'Aktualizacja projektu',
        message: 'Twój projekt jest w fazie projektowania graficznego.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        orderId: '123'
      }
    ];

    return NextResponse.json(mockNotifications);
  } catch (error) {
    console.error('Błąd pobierania powiadomień:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Nieautoryzowany dostęp' }, { status: 401 });
    }

    const { type, title, message, orderId } = await request.json();

    // Tymczasowo zwracamy przykładowe dane
    const notification = {
      id: Date.now().toString(),
      userId: session.user.id,
      type,
      title,
      message,
      orderId: orderId || null,
      timestamp: new Date().toISOString(),
      read: false
    };

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Błąd tworzenia powiadomienia:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
