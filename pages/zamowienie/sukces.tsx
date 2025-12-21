'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PaymentSuccess() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (router.isReady && router.query.session_id) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/stripe/verify-payment?session_id=${router.query.session_id}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      } else {
        // Jeśli weryfikacja się nie powiedzie, przekieruj do panelu
        router.push('/panel');
      }
    } catch (error) {
      console.error('Błąd weryfikacji płatności:', error);
      router.push('/panel');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Weryfikacja płatności...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Płatność zakończona sukcesem!</h1>
          <p className="text-gray-600 mb-8">
            Dziękujemy za złożenie zamówienia. Twoja płatność została pomyślnie przetworzona.
          </p>

          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Szczegóły zamówienia:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Numer zamówienia: #{orderData.orderId?.slice(-8)}</p>
                <p>Kwota: {orderData.amount?.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                <p>Status: Opłacone</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/panel" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Przejdź do panelu
            </Link>
            <Link href="/" className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Strona główna
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Potwierdzenie zamówienia zostało wysłane na adres email.</p>
            <p className="mt-2">Skontaktujemy się z Tobą w ciągu 24h w celu omówienia szczegółów.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
