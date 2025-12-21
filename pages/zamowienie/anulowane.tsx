'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PaymentCancelled() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulacja ładowania - w rzeczywistości moglibyśmy zaktualizować status zamówienia
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Przetwarzanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Płatność anulowana</h1>
          <p className="text-gray-600 mb-8">
            Twoja płatność została anulowana. Zamówienie nie zostało zrealizowane.
          </p>

          <div className="space-y-3">
            <Link href="/panel/zamow" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Spróbuj ponownie
            </Link>
            <Link href="/panel" className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Wróć do panelu
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Napotkałeś problem z płatnością?</p>
            <p className="mt-2">
              Skontaktuj się z nami: 
              <a href="mailto:kontakt@designstron.pl" className="text-blue-600 hover:underline ml-1">
                kontakt@designstron.pl
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
