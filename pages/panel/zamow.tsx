'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';
import { stripePromise } from '@/lib/stripe';
import { KONFIGURACJA_KOSZTOW } from '@/lib/koszty';
import { PakietType, UslugaDodatkowaType } from '@/types';

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

interface DaneZamawiajacego {
  typ: 'osoba' | 'firma';
  imieNazwisko: string;
  email: string;
  telefon: string;
  nazwaFirmy: string;
  nip: string;
  adres: string;
}

export default function ZamowStrone() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kalkulacja, setKalkulacja] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState<'form' | 'data' | 'payment'>('form');
  const [orderData, setOrderData] = useState<any>(null);
  const [prefilledFromKalkulator, setPrefilledFromKalkulator] = useState(false);

  const [daneZamawiajacego, setDaneZamawiajacego] = useState<DaneZamawiajacego>({
    typ: 'osoba',
    imieNazwisko: '',
    email: '',
    telefon: '',
    nazwaFirmy: '',
    nip: '',
    adres: ''
  });

  const [formularz, setFormularz] = useState<FormularzZamowienia>({
    pakiet: 'basic',
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
      const callbackUrl = encodeURIComponent('/panel/zamow');
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
    }
  }, [status, router]);

  useEffect(() => {
    if (!mounted) return;
    if (!session?.user) return;
    if (currentStep !== 'form') return;
    if (prefilledFromKalkulator) return;

    const raw = localStorage.getItem('kalkulatorOrder');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.orderItems?.length && parsed?.totalAmount) {
        setOrderData({
          orderItems: parsed.orderItems,
          totalAmount: Number(parsed.totalAmount),
          formularz,
          calculation: parsed.calculation,
          source: 'kalkulator'
        });
        setPrefilledFromKalkulator(true);
        setCurrentStep('data');
      }
    } catch {
      // ignore
    }
  }, [mounted, session, currentStep, prefilledFromKalkulator]);

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

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
    if (!session?.user) return;
    setDaneZamawiajacego(prev => ({
      ...prev,
      imieNazwisko: session.user.name || prev.imieNazwisko,
      email: session.user.email || prev.email
    }));
  }, [session]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!kalkulacja) {
        throw new Error('Błąd kalkulacji ceny');
      }

      // Przygotowanie danych zamówienia
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
          description: `Dodatkowa usługa: ${usluga.nazwa}`,
          quantity: 1,
          unitPrice: usluga.cena,
          totalPrice: usluga.cena
        });
      });

      // Zapisz dane zamówienia i przejdź do kroku danych
      setOrderData({
        orderItems,
        totalAmount: Number(kalkulacja.sumaCalkowita),
        formularz
      });
      setCurrentStep('data');
    } catch (error: any) {
      console.error('Błąd podczas przygotowywania zamówienia:', error);
      alert(error.message || 'Wystąpił błąd podczas przygotowywania zamówienia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!daneZamawiajacego.imieNazwisko || !daneZamawiajacego.email) {
      alert('Uzupełnij imię i nazwisko oraz email.');
      return;
    }
    if (daneZamawiajacego.typ === 'firma' && (!daneZamawiajacego.nazwaFirmy || !daneZamawiajacego.nip)) {
      alert('Uzupełnij nazwę firmy oraz NIP.');
      return;
    }

    setOrderData((prev: any) => ({
      ...prev,
      daneZamawiajacego
    }));
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!orderData) return;

    // Validate totalAmount before sending to API
    if (isNaN(orderData.totalAmount) || orderData.totalAmount <= 0) {
      alert('Błąd: Nieprawidłowa kwota płatności. Spróbuj ponownie.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        throw new Error('Brak emaila użytkownika');
      }
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: orderData.orderItems,
          totalAmount: orderData.totalAmount,
          userEmail,
          customerPhone: orderData?.daneZamawiajacego?.telefon
        }),
      });

      const sessionData = await response.json();

      if (response.ok) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: sessionData.sessionId,
          });
          if (error) {
            throw error.message;
          }
        }
      } else {
        throw new Error(sessionData.message || 'Wystąpił błąd podczas tworzenia sesji płatności');
      }
    } catch (error: any) {
      console.error('Błąd podczas płatności:', error);
      alert(error.message || 'Wystąpił błąd podczas płatności');
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
    <div data-theme={isDark ? 'dark' : 'light'} className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
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

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="zamow" />

      {/* Main Content */}
      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Zamów <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">stronę internetową</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Wypełnij formularz i zamów swoją wymarzoną stronę</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className={`flex items-center ${currentStep === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Formularz</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'data' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Dane</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium">Płatność</span>
              </div>
            </div>
          </div>

          {/* Step 1: Form */}
          {currentStep === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-8">
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
                  {isSubmitting ? 'Przetwarzanie...' : 'Dalej'}
                </button>
              </div>
            )}
            </form>
          )}

          {/* Step 2: Data */}
          {currentStep === 'data' && (
            <form onSubmit={handleDataSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                  <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Dane zamawiającego</h2>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Typ zamawiającego *
                      </label>
                      <select
                        value={daneZamawiajacego.typ}
                        onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, typ: e.target.value as DaneZamawiajacego['typ'] }))}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                        required
                      >
                        <option value="osoba">Osoba fizyczna</option>
                        <option value="firma">Firma</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        value={daneZamawiajacego.imieNazwisko}
                        onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, imieNazwisko: e.target.value }))}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={daneZamawiajacego.email}
                        onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={daneZamawiajacego.telefon}
                        onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, telefon: e.target.value }))}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                        placeholder="+48 123 456 789"
                      />
                    </div>

                    {daneZamawiajacego.typ === 'firma' && (
                      <>
                        <div>
                          <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                            Nazwa firmy *
                          </label>
                          <input
                            type="text"
                            value={daneZamawiajacego.nazwaFirmy}
                            onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, nazwaFirmy: e.target.value }))}
                            className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                            required
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                            NIP *
                          </label>
                          <input
                            type="text"
                            value={daneZamawiajacego.nip}
                            onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, nip: e.target.value }))}
                            className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Adres (do faktury)
                      </label>
                      <textarea
                        value={daneZamawiajacego.adres}
                        onChange={(e) => setDaneZamawiajacego(prev => ({ ...prev, adres: e.target.value }))}
                        rows={3}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                        placeholder="Ulica, numer, kod, miasto"
                      />
                    </div>
                  </div>
                </div>

                <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                  <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Podsumowanie</h2>

                  {orderData ? (
                    <>
                      <div className="space-y-2">
                        {orderData.orderItems?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span className={textSecondary}>{item.name}</span>
                            <span className={textPrimary}>
                              {Number(item.totalPrice ?? item.unitPrice ?? 0).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className={`text-xl font-bold ${textPrimary}`}>Suma:</span>
                          <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {isNaN(orderData.totalAmount || 0) ? 'Błąd obliczeń' : Number(orderData.totalAmount || 0).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className={textSecondary}>Brak danych koszyka.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBackToForm}
                  className={`flex-1 px-6 py-3 border-2 ${isDark ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-xl font-medium hover:bg-gray-100 transition-all`}
                >
                  Wróć
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Przejdź do płatności
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && orderData && (
            <div className="space-y-8">
              <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Płatność</h2>
                <div className="text-center mb-8">
                  <div className={`text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4`}>
                    {isNaN(orderData.totalAmount) ? 'Błąd obliczeń' : orderData.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                  </div>
                  <p className={`${textSecondary}`}>Kliknij przycisk poniżej, aby przejść do bezpiecznej płatności</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('data')}
                  className={`flex-1 px-6 py-3 border-2 ${isDark ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-xl font-medium hover:bg-gray-100 transition-all`}
                >
                  Wróć
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Zapłać'}
                </button>
              </div>
            </div>
          )}
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

        [data-theme='dark'] input:-webkit-autofill,
        [data-theme='dark'] textarea:-webkit-autofill,
        [data-theme='dark'] select:-webkit-autofill {
          -webkit-text-fill-color: #ffffff;
          box-shadow: 0 0 0px 1000px rgba(15, 23, 42, 0.8) inset;
          transition: background-color 9999s ease-in-out 0s;
        }

        [data-theme='light'] input:-webkit-autofill,
        [data-theme='light'] textarea:-webkit-autofill,
        [data-theme='light'] select:-webkit-autofill {
          -webkit-text-fill-color: #111827;
          box-shadow: 0 0 0px 1000px rgba(249, 250, 251, 0.9) inset;
          transition: background-color 9999s ease-in-out 0s;
        }

        [data-theme='dark'] select option {
          background-color: #0f172a;
          color: #ffffff;
        }

        [data-theme='light'] select option {
          background-color: #ffffff;
          color: #111827;
        }
      `}</style>
    </div>
  );
}
