'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';
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
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white/80 border-gray-200';

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

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
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
      <Head>
        <title>Zamów stronę - Designstron</title>
        <meta name="description" content="Zamów profesjonalną stronę internetową" />
      </Head>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/30'} rounded-full blur-3xl transition-all duration-1000`}
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div 
          className={`absolute w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-purple-400/30'} rounded-full blur-3xl transition-all duration-1000`}
          style={{
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
          }}
        />
        <div className={`absolute inset-0 ${isDark ? 'opacity-30' : 'opacity-20'} bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]`} />
      </div>

      {/* Simple Header */}
      <header className={`fixed top-0 w-full z-50 ${cardBg} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/panel" className="relative group">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DesignStron.pl
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/panel"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Panel
            </Link>
            <Link
              href="/panel/zamow"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Zamów stronę
            </Link>
            <Link
              href="/panel/ustawienia"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Ustawienia
            </Link>
            <button
              onClick={() => signOut()}
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}
            >
              Wyloguj się
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Zamów <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">stronę internetową</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Wypełnij formularz i zamów swoją wymarzoną stronę</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Wybór pakietu */}
            <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
              <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Wybierz pakiet</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      formularz.pakiet === key
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'border-gray-300/50 hover:border-gray-400'
                    }`}>
                      <h3 className={`font-bold text-lg mb-3 ${textPrimary}`}>{(pakiet as any).nazwa}</h3>
                      <p className={`text-3xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
                        {(pakiet as any).bazowaCena} zł
                      </p>
                      <p className={`${textSecondary} text-sm`}>{(pakiet as any).opis}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dodatkowe opcje */}
            <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
              <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Dodatkowe opcje</h2>
              
              <div className="mb-8">
                <label className={`block text-sm font-bold mb-3 ${textPrimary}`}>
                  Dodatkowe podstrony
                </label>
                <input
                  type="number"
                  min="0"
                  value={formularz.dodatkowePodstrony}
                  onChange={(e) => setFormularz(prev => ({ ...prev, dodatkowePodstrony: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                />
                <p className={`${textSecondary} text-sm mt-2`}>Koszt: {KONFIGURACJA_KOSZTOW.uslugiDodatkowe.podstrona.cena} zł za sztukę</p>
              </div>

              <div>
                <h3 className={`font-bold mb-4 ${textPrimary}`}>Usługi dodatkowe</h3>
                <div className="space-y-3">
                  {Object.entries(KONFIGURACJA_KOSZTOW.uslugiDodatkowe).filter(([key]) => key !== 'podstrona').map(([key, usluga]) => (
                    <label key={key} className="flex items-center p-4 rounded-xl border-2 border-gray-300/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formularz.uslugiDodatkowe.includes(key as UslugaDodatkowaType)}
                        onChange={() => handleUslugaToggle(key as UslugaDodatkowaType)}
                        className="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className={`font-bold ${textPrimary}`}>{(usluga as any).nazwa}</span>
                        <span className="ml-3 font-bold text-blue-400">{(usluga as any).cena} zł</span>
                        <p className={`${textSecondary} text-sm mt-1`}>{(usluga as any).opis}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Szczegóły projektu */}
            <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
              <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Szczegóły projektu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Nazwa firmy *
                  </label>
                  <input
                    type="text"
                    value={formularz.nazwaFirmy}
                    onChange={(e) => setFormularz(prev => ({ ...prev, nazwaFirmy: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Branża *
                  </label>
                  <select
                    value={formularz.branża}
                    onChange={(e) => setFormularz(prev => ({ ...prev, branża: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
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

                <div className="md:col-span-2">
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Opis projektu *
                  </label>
                  <textarea
                    value={formularz.opisProjektu}
                    onChange={(e) => setFormularz(prev => ({ ...prev, opisProjektu: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="Opisz jak ma wyglądać Twoja strona, jakie funkcje ma mieć, itp."
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Preferowana kolorystyka
                  </label>
                  <input
                    type="text"
                    value={formularz.kolorystyka}
                    onChange={(e) => setFormularz(prev => ({ ...prev, kolorystyka: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="np. niebieski, biały, szary"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Termin realizacji
                  </label>
                  <input
                    type="text"
                    value={formularz.terminRealizacji}
                    onChange={(e) => setFormularz(prev => ({ ...prev, terminRealizacji: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="np. jak najszybciej, do 2 tygodni, konkretna data"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Strony przykładowe, które Ci się podobają
                  </label>
                  <input
                    type="text"
                    value={formularz.stronyPrzykładowe.join(', ')}
                    onChange={(e) => setFormularz(prev => ({ 
                      ...prev, 
                      stronyPrzykładowe: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="Wpisz URL-e oddzielone przecinkami"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center p-4 rounded-xl border-2 border-gray-300/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formularz.logo}
                      onChange={(e) => setFormularz(prev => ({ ...prev, logo: e.target.checked }))}
                      className="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`${textPrimary} font-medium`}>Potrzebuję zaprojektowania logo</span>
                  </label>

                  <label className="flex items-center p-4 rounded-xl border-2 border-gray-300/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formularz.teksty}
                      onChange={(e) => setFormularz(prev => ({ ...prev, teksty: e.target.checked }))}
                      className="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`${textPrimary} font-medium`}>Potrzebuję pomocy w napisaniu tekstów</span>
                  </label>

                  <label className="flex items-center p-4 rounded-xl border-2 border-gray-300/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formularz.zdjecia}
                      onChange={(e) => setFormularz(prev => ({ ...prev, zdjecia: e.target.checked }))}
                      className="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`${textPrimary} font-medium`}>Potrzebuję zdjęć do strony</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Dodatkowe uwagi
                  </label>
                  <textarea
                    value={formularz.uwagi}
                    onChange={(e) => setFormularz(prev => ({ ...prev, uwagi: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="Wszystkie dodatkowe informacje, które uważasz za ważne"
                  />
                </div>
              </div>
            </div>

            {/* Podsumowanie i płatność */}
            {kalkulacja && (
              <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Podsumowanie zamówienia</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className={`${textSecondary}`}>{kalkulacja.szczegolyCeny.pakiet.nazwa}</span>
                    <span className={`font-bold text-lg ${textPrimary}`}>{kalkulacja.szczegolyCeny.pakiet.cena} zł</span>
                  </div>
                  {kalkulacja.szczegolyCeny.dodatkowePodstrony && (
                    <div className="flex justify-between items-center">
                      <span className={`${textSecondary}`}>Dodatkowe podstrony ({kalkulacja.szczegolyCeny.dodatkowePodstrony.ilosc} szt.)</span>
                      <span className={`font-bold ${textPrimary}`}>{kalkulacja.szczegolyCeny.dodatkowePodstrony.cenaCalkowita} zł</span>
                    </div>
                  )}
                  {kalkulacja.szczegolyCeny.uslugiDodatkowe.map((usluga: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className={`${textSecondary}`}>{usluga.nazwa}</span>
                      <span className={`font-bold ${textPrimary}`}>{usluga.cena} zł</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300/50 pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className={`${textPrimary}`}>Suma całkowita:</span>
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{kalkulacja.sumaCalkowita} zł</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Przejdź do płatności'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
      `}</style>
    </div>
  );
}
