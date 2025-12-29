import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Nieautoryzowany dostęp' }, { status: 401 });
    }

    // Tymczasowo zwracamy sukces - w realnej aplikacji oznaczymy wszystkie jako przeczytane w bazie
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd oznaczania wszystkich jako przeczytane:', error);
    return NextResponse.json({ error: 'Wystąpił błąd' }, { status: 500 });
  }
}
