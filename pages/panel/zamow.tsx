'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { KONFIGURACJA_KOSZTOW } from '@/lib/koszty';
import { PakietType, UslugaDodatkowaType } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FormularzZamowienia {
  pakiet: PakietType;
  dodatkowePodstrony: number;
  uslugiDodatkowe: UslugaDodatkowaType[];
  nazwaFirmy: string;
  branża: string;
  opisProjektu: string;
  kolorystyka: string;
  stronyPrzykładowe: string[];
  logo: boolean;
  teksty: boolean;
  zdjecia: boolean;
  terminRealizacji: string;
  budzet: string;
  uwagi: string;
}

export default function ZamowStrone() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kalkulacja, setKalkulacja] = useState<any>(null);

  const [formularz, setFormularz] = useState<FormularzZamowienia>({
    pakiet: 'wizytowka',
    dodatkowePodstrony: 0,
    uslugiDodatkowe: [],
    nazwaFirmy: '',
    branża: '',
    opisProjektu: '',
    kolorystyka: '',
    stronyPrzykładowe: [],
    logo: false,
    teksty: false,
    zdjecia: false,
    terminRealizacji: '',
    budzet: '',
    uwagi: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (formularz.pakiet) {
      const wynik = KONFIGURACJA_KOSZTOW.obliczCene({
        pakiet: formularz.pakiet,
        dodatkowePodstrony: formularz.dodatkowePodstrony,
        uslugiDodatkowe: formularz.uslugiDodatkowe
      });
      setKalkulacja(wynik);
    }
  }, [formularz.pakiet, formularz.dodatkowePodstrony, formularz.uslugiDodatkowe]);

  const handleUslugaToggle = (usluga: UslugaDodatkowaType) => {
    setFormularz(prev => ({
      ...prev,
      uslugiDodatkowe: prev.uslugiDodatkowe.includes(usluga)
        ? prev.uslugiDodatkowe.filter(u => u !== usluga)
        : [...prev.uslugiDodatkowe, usluga]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!kalkulacja) {
        throw new Error('Błąd kalkulacji ceny');
      }

      // Przygotowanie order items dla Stripe
      const orderItems = [
        {
          name: kalkulacja.szczegolyCeny.pakiet.nazwa,
          description: `Pakiet: ${kalkulacja.szczegolyCeny.pakiet.nazwa}`,
          quantity: 1,
          unitPrice: kalkulacja.szczegolyCeny.pakiet.cena,
          totalPrice: kalkulacja.szczegolyCeny.pakiet.cena
        }
      ];

      if (kalkulacja.szczegolyCeny.dodatkowePodstrony) {
        orderItems.push({
          name: 'Dodatkowe podstrony',
          description: `${kalkulacja.szczegolyCeny.dodatkowePodstrony.ilosc} dodatkowych podstron`,
          quantity: 1,
          unitPrice: kalkulacja.szczegolyCeny.dodatkowePodstrony.cenaCalkowita,
          totalPrice: kalkulacja.szczegolyCeny.dodatkowePodstrony.cenaCalkowita
        });
      }

      kalkulacja.szczegolyCeny.uslugiDodatkowe.forEach((usluga: any) => {
        orderItems.push({
          name: usluga.nazwa,
          description: `Usługa dodatkowa: ${usluga.nazwa}`,
          quantity: 1,
          unitPrice: usluga.cena,
          totalPrice: usluga.cena
        });
      });

      // Tworzenie sesji Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems,
          userEmail: session?.user?.email,
          totalAmount: kalkulacja.sumaCalkowita,
          szczegolyZamowienia: formularz
        }),
      });

      const { sessionId, orderId } = await response.json();

      // Przekierowanie do Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Błąd składania zamówienia:', error);
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/panel" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DesignStron.pl
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/panel" className="text-gray-600 hover:text-gray-900">
                Panel
              </Link>
              <Link href="/panel/ustawienia" className="text-gray-600 hover:text-gray-900">
                Ustawienia
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zamów stronę internetową</h1>
          <p className="text-gray-600">Wypełnij formularz, aby zamówić swoją wymarzoną stronę</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Wybór pakietu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Wybierz pakiet</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(KONFIGURACJA_KOSZTOW.pakiety).map(([key, pakiet]) => (
                <label key={key} className="block">
                  <input
                    type="radio"
                    name="pakiet"
                    value={key}
                    checked={formularz.pakiet === key}
                    onChange={(e) => setFormularz(prev => ({ ...prev, pakiet: e.target.value as PakietType }))}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formularz.pakiet === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <h3 className="font-semibold text-gray-900">{(pakiet as any).nazwa}</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2">{(pakiet as any).bazowaCena} zł</p>
                    <p className="text-sm text-gray-600">{(pakiet as any).opis}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dodatkowe opcje */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dodatkowe opcje</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dodatkowe podstrony
              </label>
              <input
                type="number"
                min="0"
                value={formularz.dodatkowePodstrony}
                onChange={(e) => setFormularz(prev => ({ ...prev, dodatkowePodstrony: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Koszt: {KONFIGURACJA_KOSZTOW.uslugiDodatkowe.podstrona.cena} zł za sztukę</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Usługi dodatkowe</h3>
              <div className="space-y-2">
                {Object.entries(KONFIGURACJA_KOSZTOW.uslugiDodatkowe).filter(([key]) => key !== 'podstrona').map(([key, usluga]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formularz.uslugiDodatkowe.includes(key as UslugaDodatkowaType)}
                      onChange={() => handleUslugaToggle(key as UslugaDodatkowaType)}
                      className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{(usluga as any).nazwa}</span>
                      <span className="ml-2 text-blue-600 font-semibold">{(usluga as any).cena} zł</span>
                      <p className="text-sm text-gray-500">{(usluga as any).opis}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Szczegóły projektu */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Szczegóły projektu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa firmy *
                </label>
                <input
                  type="text"
                  value={formularz.nazwaFirmy}
                  onChange={(e) => setFormularz(prev => ({ ...prev, nazwaFirmy: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branża *
                </label>
                <select
                  value={formularz.branża}
                  onChange={(e) => setFormularz(prev => ({ ...prev, branża: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Wybierz branżę</option>
                  <option value="restauracja">Restauracja / Gastronomia</option>
                  <option value="sklep">Sklep / E-commerce</option>
                  <option value="uslugi">Usługi</option>
                  <option value="firma">Firma / Biuro</option>
                  <option value="kancelaria">Kancelaria prawnicza</option>
                  <option value="salon">Salon fryzjerski / kosmetyczny</option>
                  <option value="fitness">Fitness / Siłownia</option>
                  <option value="medycyna">Medycyna / Zdrowie</option>
                  <option value="edukacja">Edukacja / Szkolenia</option>
                  <option value="inna">Inna</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis projektu *
                </label>
                <textarea
                  value={formularz.opisProjektu}
                  onChange={(e) => setFormularz(prev => ({ ...prev, opisProjektu: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Opisz jak ma wyglądać Twoja strona, jakie funkcje ma mieć, itp."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferowana kolorystyka
                </label>
                <input
                  type="text"
                  value={formularz.kolorystyka}
                  onChange={(e) => setFormularz(prev => ({ ...prev, kolorystyka: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="np. niebieski, biały, szary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strony przykładowe, które Ci się podobają
                </label>
                <input
                  type="text"
                  value={formularz.stronyPrzykładowe.join(', ')}
                  onChange={(e) => setFormularz(prev => ({ 
                    ...prev, 
                    stronyPrzykładowe: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wpisz URL-e oddzielone przecinkami"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termin realizacji
                </label>
                <input
                  type="text"
                  value={formularz.terminRealizacji}
                  onChange={(e) => setFormularz(prev => ({ ...prev, terminRealizacji: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="np. jak najszybciej, do 2 tygodni, konkretna data"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formularz.logo}
                    onChange={(e) => setFormularz(prev => ({ ...prev, logo: e.target.checked }))}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Potrzebuję zaprojektowania logo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formularz.teksty}
                    onChange={(e) => setFormularz(prev => ({ ...prev, teksty: e.target.checked }))}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Potrzebuję pomocy w napisaniu tekstów</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formularz.zdjecia}
                    onChange={(e) => setFormularz(prev => ({ ...prev, zdjecia: e.target.checked }))}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-900">Potrzebuję zdjęć do strony</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dodatkowe uwagi
                </label>
                <textarea
                  value={formularz.uwagi}
                  onChange={(e) => setFormularz(prev => ({ ...prev, uwagi: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wszystkie dodatkowe informacje, które uważasz za ważne"
                />
              </div>
            </div>
          </div>

          {/* Podsumowanie i płatność */}
          {kalkulacja && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Podsumowanie zamówienia</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>{kalkulacja.szczegolyCeny.pakiet.nazwa}</span>
                  <span className="font-semibold">{kalkulacja.szczegolyCeny.pakiet.cena} zł</span>
                </div>
                {kalkulacja.szczegolyCeny.dodatkowePodstrony && (
                  <div className="flex justify-between">
                    <span>Dodatkowe podstrony ({kalkulacja.szczegolyCeny.dodatkowePodstrony.ilosc} szt.)</span>
                    <span className="font-semibold">{kalkulacja.szczegolyCeny.dodatkowePodstrony.cenaCalkowita} zł</span>
                  </div>
                )}
                {kalkulacja.szczegolyCeny.uslugiDodatkowe.map((usluga: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{usluga.nazwa}</span>
                    <span className="font-semibold">{usluga.cena} zł</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Suma całkowita:</span>
                    <span className="text-blue-600">{kalkulacja.sumaCalkowita} zł</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Przetwarzanie...' : 'Przejdź do płatności'}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
