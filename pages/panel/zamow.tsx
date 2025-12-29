'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { stripePromise } from '@/lib/stripe';
import { KONFIGURACJA_KOSZTOW } from '@/lib/koszty';
import { PakietType, UslugaDodatkowaType } from '@/types';
import NotificationCenter from '@/components/NotificationCenter';

interface FormularzZamowienia {
  pakiet: PakietType;
  liczbaPodstron: number;
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

interface HostingData {
  plan: 'basic' | 'premium' | null;
  domena: string;
  ssl: boolean;
  period: number;
  zdecydujePozniej: boolean;
}

export default function ZamowStrone() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kalkulacja, setKalkulacja] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'data' | 'hosting' | 'summary' | 'payment'>('form');
  const [orderData, setOrderData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [daneZamawiajacego, setDaneZamawiajacego] = useState<DaneZamawiajacego>({
    typ: 'osoba',
    imieNazwisko: '',
    email: '',
    telefon: '',
    nazwaFirmy: '',
    nip: '',
    adres: ''
  });

  const [isAutofilled, setIsAutofilled] = useState({
    telefon: false
  });

  const [hostingData, setHostingData] = useState<HostingData>({
    plan: null,
    domena: '',
    ssl: false,
    period: 12,
    zdecydujePozniej: false
  });

  const [formularz, setFormularz] = useState<FormularzZamowienia>({
    pakiet: 'basic',
    liczbaPodstron: 1,
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
    // Auto-zapis formularza do localStorage
    if (currentStep === 'form') {
      localStorage.setItem('zamowienie-formularz', JSON.stringify(formularz));
    }
  }, [formularz, currentStep]);

  useEffect(() => {
    // Wczytaj zapisany formularz
    if (currentStep === 'form') {
      const saved = localStorage.getItem('zamowienie-formularz');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormularz(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Błąd wczytywania zapisanego formularza:', e);
        }
      }
    }
  }, [currentStep]);

  const clearForm = () => {
    setFormularz({
      pakiet: 'basic',
      liczbaPodstron: 1,
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
    localStorage.removeItem('zamowienie-formularz');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = e.target as Element;
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

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
        dodatkowePodstrony: Math.max(0, formularz.liczbaPodstron - (formularz.pakiet === 'basic' ? 5 : formularz.pakiet === 'professional' ? 10 : 999)),
        uslugiDodatkowe: formularz.uslugiDodatkowe
      });
      
      // Dodaj koszty hostingu i SSL jeśli wybrano
      let cenaKoncowa = wynik.sumaCalkowita;
      console.log('Debug - hostingData:', hostingData);
      if (!hostingData.zdecydujePozniej && hostingData.plan) {
        const hostingCena = hostingData.plan === 'basic' ? 200 : 400;
        const hostingCost = hostingCena * hostingData.period;
        console.log('Debug - hosting cost:', hostingCost, 'plan:', hostingData.plan, 'period:', hostingData.period);
        cenaKoncowa += hostingCost;
        if (hostingData.ssl) {
          cenaKoncowa += 100;
        }
      }
      console.log('Debug - final price:', cenaKoncowa);
      
      setKalkulacja({
        ...wynik,
        sumaCalkowita: cenaKoncowa
      });
    }
  }, [formularz.pakiet, formularz.liczbaPodstron, formularz.uslugiDodatkowe, hostingData]);

  const handlePackageChange = (pakiet: PakietType) => {
    const defaultPages = pakiet === 'basic' ? 1 : pakiet === 'professional' ? 5 : 10;
    setFormularz(prev => ({
      ...prev,
      pakiet,
      liczbaPodstron: prev.liczbaPodstron < defaultPages ? defaultPages : prev.liczbaPodstron
    }));
  };

  const handleUslugaToggle = (usluga: UslugaDodatkowaType) => {
    setFormularz(prev => ({
      ...prev,
      uslugiDodatkowe: prev.uslugiDodatkowe.includes(usluga)
        ? prev.uslugiDodatkowe.filter(u => u !== usluga)
        : [...prev.uslugiDodatkowe, usluga]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formularz.nazwaFirmy.trim()) {
      newErrors.nazwaFirmy = 'Nazwa firmy jest wymagana';
    }
    if (!formularz.branża) {
      newErrors.branża = 'Wybierz branżę';
    }
    if (!formularz.opisProjektu.trim()) {
      newErrors.opisProjektu = 'Opis projektu jest wymagany';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
    setCurrentStep('hosting');
  };

  const handleHostingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Jeśli użytkownik wybrał "Zdecyduję później", pozwól przejść dalej
    if (hostingData.zdecydujePozniej) {
      setOrderData((prev: any) => ({
        ...prev,
        hostingData: null, // Brak hostingu
        totalAmount: Number(kalkulacja.sumaCalkowita)
      }));
      setCurrentStep('summary');
      return;
    }

    // Jeśli nie wybrał "Zdecyduję później", sprawdź wymagane pola
    if (!hostingData.plan) {
      alert('Wybierz plan hostingowy lub zaznacz "Zdecyduję później".');
      return;
    }

    if (!hostingData.domena.trim()) {
      alert('Podaj nazwę domeny.');
      return;
    }

    setOrderData((prev: any) => ({
      ...prev,
      hostingData,
      totalAmount: Number(kalkulacja.sumaCalkowita)
    }));
    setCurrentStep('summary');
  };

  const handleSummarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          customerPhone: orderData?.daneZamawiajacego?.telefon,
          formularz: orderData.formularz, // Dodajemy cały formularz
          hostingData: orderData.hostingData // Dodajemy dane hostingu
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

      {/* Simple Header */}
      <header className={`fixed top-0 w-full z-50 ${cardBg} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative group">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DesignStron.pl
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
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
            <div id="notifications">
              <NotificationCenter />
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <svg className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className={`w-4 h-4 ${isProfileDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} overflow-hidden`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {session?.user?.name || 'Użytkownik'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {session?.user?.email}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/panel/ustawienia"
                      className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ustawienia profilu
                      </div>
                    </Link>
                    
                    <Link
                      href="/panel/powiadomienia"
                      className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Ustawienia powiadomień
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-sm text-left ${isDark ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-gray-100'} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Wyloguj się
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/panel"
                className={`block py-3 px-4 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Panel
              </Link>
              <Link
                href="/panel/zamow"
                className="block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Zamów stronę
              </Link>
              <div className="py-3 px-4">
                <NotificationCenter />
              </div>
              
              {/* Mobile Profile Section */}
              <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} pt-3`}>
                <div className={`px-4 py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="text-sm font-medium">{session?.user?.name || 'Użytkownik'}</p>
                  <p className="text-xs opacity-75">{session?.user?.email}</p>
                </div>
                <Link
                  href="/panel/ustawienia"
                  className={`block py-3 px-4 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ustawienia profilu
                </Link>
                <Link
                  href="/panel/powiadomienia"
                  className={`block py-3 px-4 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ustawienia powiadomień
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full py-3 px-4 rounded-lg text-left ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-slate-800/50' : 'text-red-600 hover:text-red-700 hover:bg-gray-100'} font-medium transition-colors`}
                >
                  Wyloguj się
                </button>
              </div>
            </div>
          </div>
        )}
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
              <div className={`flex items-center ${currentStep === 'hosting' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'hosting' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 font-medium">Hosting</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'summary' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  4
                </div>
                <span className="ml-2 font-medium">Podsumowanie</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  5
                </div>
                <span className="ml-2 font-medium">Płatność</span>
              </div>
            </div>
          </div>

          {/* Step 1: Form */}
          {currentStep === 'form' && (
            <div className="space-y-8">
              {/* Przyciski akcji */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Wyczyść formularz
                </button>
              </div>
              
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
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Liczba podstron
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min={formularz.pakiet === 'basic' ? 1 : formularz.pakiet === 'professional' ? 5 : 10}
                      max={formularz.pakiet === 'premium' ? 50 : 25}
                      value={formularz.liczbaPodstron}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0;
                        const minValue = formularz.pakiet === 'basic' ? 1 : formularz.pakiet === 'professional' ? 5 : 10;
                        setFormularz(prev => ({ ...prev, liczbaPodstron: Math.max(minValue, newValue) }));
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className={`w-16 text-center font-bold ${textPrimary}`}>
                      {formularz.liczbaPodstron}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formularz.pakiet === 'basic' ? '1' : formularz.pakiet === 'professional' ? '5' : '10'}</span>
                    <span>{formularz.pakiet === 'basic' ? '10' : formularz.pakiet === 'professional' ? '15' : '25'}</span>
                    <span>{formularz.pakiet === 'basic' ? '15' : formularz.pakiet === 'professional' ? '20' : '35'}</span>
                    <span>{formularz.pakiet === 'basic' ? '20' : formularz.pakiet === 'professional' ? '25' : '50'}</span>
                  </div>
                  {formularz.liczbaPodstron > (formularz.pakiet === 'basic' ? 5 : formularz.pakiet === 'professional' ? 10 : 999) && (
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      Dodatkowe podstrony: +200 PLN/szt.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className={`font-bold mb-4 ${textPrimary}`}>Usługi dodatkowe</h3>
                <div className="space-y-3">
                  {Object.entries(KONFIGURACJA_KOSZTOW.uslugiDodatkowe).filter(([key]) => 
    key !== 'podstrona' && 
    key !== 'hosting' && 
    key !== 'domain' && 
    key !== 'ssl'
  ).map(([key, usluga]) => (
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
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 ${errors.nazwaFirmy ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.nazwaFirmy && (
                    <p className="text-red-500 text-sm mt-1">{errors.nazwaFirmy}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Branża *
                  </label>
                  <select
                    value={formularz.branża}
                    onChange={(e) => setFormularz(prev => ({ ...prev, branża: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white text-black border-gray-300' : 'bg-white text-black border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
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

            {/* Podsumowanie ceny */}
            <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
              <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Podsumowanie zamówienia</h2>
              
              {kalkulacja && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={textPrimary}>Pakiet:</span>
                    <span className={`font-bold ${textPrimary}`}>
                      {kalkulacja.szczegolyCeny.pakiet.nazwa}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textPrimary}>Cena pakietu:</span>
                    <span className="font-bold">
                      {kalkulacja.szczegolyCeny.pakiet.cena.toLocaleString('pl-PL')} zł
                    </span>
                  </div>
                  {kalkulacja.szczegolyCeny.dodatkowePodstrony && (
                    <div className="flex justify-between items-center">
                      <span className={textPrimary}>Dodatkowe podstrony:</span>
                      <span className="font-bold">
                        +{kalkulacja.szczegolyCeny.dodatkowePodstrony.cenaCalkowita.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  )}
                  {kalkulacja.szczegolyCeny.uslugiDodatkowe.map((usluga: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className={textPrimary}>{usluga.nazwa}:</span>
                      <span className="font-bold">
                        +{usluga.cena.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  ))}
                  {!hostingData.zdecydujePozniej && hostingData.plan && (
                    <div className="flex justify-between items-center">
                      <span className={textPrimary}>Hosting ({hostingData.plan === 'basic' ? 'Basic' : 'Premium'} - {hostingData.period} miesięcy):</span>
                      <span className="font-bold">
                        +{((hostingData.plan === 'basic' ? 200 : 400) * hostingData.period).toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  )}
                  {!hostingData.zdecydujePozniej && hostingData.ssl && (
                    <div className="flex justify-between items-center">
                      <span className={textPrimary}>Certyfikat SSL:</span>
                      <span className="font-bold">
                        +100 zł
                      </span>
                    </div>
                  )}
                  <div className={`border-t pt-4 mt-4 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className={textPrimary}>Suma całkowita:</span>
                      <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {kalkulacja.sumaCalkowita.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={clearForm}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Wyczyść formularz
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Przetwarzanie...' : 'Dalej'}
              </button>
            </div>

                        </form>
            </div>
          )}

          {/* Step 2: Data */}
          {currentStep === 'data' && (
            <form onSubmit={handleDataSubmit} className="space-y-8">
              <div className="max-w-2xl mx-auto">
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
                          className={`w-full px-4 py-3 bg-white text-black border-gray-300 border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
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
                          onChange={(e) => {
                            setDaneZamawiajacego(prev => ({ ...prev, telefon: e.target.value }));
                            setIsAutofilled(prev => ({ ...prev, telefon: false }));
                          }}
                          onAnimationStart={(e) => {
                            if (e.animationName === 'onAutoFillStart') {
                              setIsAutofilled(prev => ({ ...prev, telefon: true }));
                            }
                          }}
                          className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} ${isAutofilled.telefon ? (isDark ? 'text-white' : 'text-gray-900') : ''} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                          placeholder="+48 123 456 789"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                    <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Dane firmy</h2>
                    <div className="space-y-4">
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
                  Przejdź dalej
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Hosting */}
          {currentStep === 'hosting' && (
            <form onSubmit={handleHostingSubmit} className="space-y-8">
              <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Hosting i domena (opcjonalnie)</h2>
                
                <div className="mb-6">
                  <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500/50 transition-all">
                    <input
                      type="checkbox"
                      checked={hostingData.zdecydujePozniej}
                      onChange={(e) => setHostingData(prev => ({ ...prev, zdecydujePozniej: e.target.checked }))}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className={`font-bold ${textPrimary}`}>Zdecyduję później</span>
                      <p className={`${textSecondary} text-sm`}>Możesz dodać hosting w dowolnym momencie po zakupie</p>
                    </div>
                  </label>
                </div>

                {!hostingData.zdecydujePozniej && (
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                        Plan hostingowy
                      </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <input
                          type="radio"
                          name="plan"
                          value="basic"
                          checked={hostingData.plan === 'basic'}
                          onChange={(e) => setHostingData(prev => ({ ...prev, plan: e.target.value as 'basic' | 'premium' }))}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          hostingData.plan === 'basic'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Basic</h3>
                          <p className="text-2xl font-bold text-blue-400 mb-2">200 zł/miesiąc</p>
                          <p className={`${textSecondary} text-sm`}>Idealny dla małych stron</p>
                        </div>
                      </label>
                      
                      <label className="block">
                        <input
                          type="radio"
                          name="plan"
                          value="premium"
                          checked={hostingData.plan === 'premium'}
                          onChange={(e) => setHostingData(prev => ({ ...prev, plan: e.target.value as 'basic' | 'premium' }))}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          hostingData.plan === 'premium'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Premium</h3>
                          <p className="text-2xl font-bold text-blue-400 mb-2">400 zł/miesiąc</p>
                          <p className={`${textSecondary} text-sm`}>Dla dużych projektów</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Nazwa domeny *
                    </label>
                    <input
                      type="text"
                      value={hostingData.domena}
                      onChange={(e) => setHostingData(prev => ({ ...prev, domena: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="twojadomena.pl"
                      required
                    />
                    <p className={`${textSecondary} text-sm mt-1`}>Podaj preferowaną nazwę domeny. Sprawdzimy dostępność.</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-4 ${textPrimary}`}>
                      Okres subskrypcji: {hostingData.period} {hostingData.period === 1 ? 'miesiąc' : hostingData.period >= 5 ? 'miesięcy' : 'miesiące'}
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={hostingData.period}
                        onChange={(e) => setHostingData(prev => ({ ...prev, period: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm">
                        <span className={textSecondary}>1 miesiąc</span>
                        <span className={textSecondary}>24 miesiące</span>
                      </div>
                      {(() => {
                        const discount = hostingData.period >= 12 ? 0.15 : hostingData.period >= 6 ? 0.10 : hostingData.period >= 3 ? 0.05 : 0;
                        if (discount > 0) {
                          return (
                            <div className={`p-3 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                              <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                                Oszczędzasz {(discount * 100).toFixed(0)}% dzięki dłuższemu okresowi!
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={hostingData.ssl}
                        onChange={(e) => setHostingData(prev => ({ ...prev, ssl: e.target.checked }))}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className={`font-medium ${textPrimary}`}>Certyfikat SSL</span>
                        <p className={`${textSecondary} text-sm`}>Bezpieczeństwo i zaufanie klientów (+100 zł jednorazowo)</p>
                      </div>
                    </label>
                  </div>
                </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('data')}
                  className={`flex-1 px-6 py-3 border-2 ${isDark ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-xl font-medium hover:bg-gray-100 transition-all`}
                >
                  Wróć
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Przetwarzanie...' : 'Przejdź do płatności'}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Summary */}
          {currentStep === 'summary' && orderData && (
            <form onSubmit={handleSummarySubmit} className="space-y-8">
              <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Podsumowanie zamówienia</h2>
                
                {/* Podsumowanie zamówienia */}
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-3 ${textPrimary}`}>Szczegóły zamówienia</h3>
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
                        {orderData.hostingData && (
                          <>
                            <div className="flex justify-between">
                              <span className={textSecondary}>Hosting {orderData.hostingData.plan === 'basic' ? 'Basic' : 'Premium'} ({orderData.hostingData.period} miesięcy)</span>
                              <span className={textPrimary}>
                                {((orderData.hostingData.plan === 'basic' ? 200 : 400) * orderData.hostingData.period).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                              </span>
                            </div>
                            {orderData.hostingData.ssl && (
                              <div className="flex justify-between">
                                <span className={textSecondary}>Certyfikat SSL</span>
                                <span className={textPrimary}>100 zł</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className={textSecondary}>Brak danych zamówienia.</p>
                  )}
                </div>

                
                {/* Suma */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600/20 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} border`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${textPrimary}`}>Suma całkowita:</span>
                    <span className={`text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
                      {isNaN(orderData.totalAmount) ? 'Błąd obliczeń' : orderData.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('hosting')}
                  className={`flex-1 px-6 py-3 border-2 ${isDark ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-xl font-medium hover:bg-gray-100 transition-all`}
                >
                  Wróć
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Dalej do płatności
                </button>
              </div>
            </form>
          )}

          {/* Step 5: Payment */}
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
                  onClick={() => setCurrentStep('summary')}
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
