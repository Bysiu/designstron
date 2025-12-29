'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavbarAuth from '@/components/NavbarAuth';

interface CalculationData {
  packageType: 'basic' | 'professional' | 'premium';
  pages: number;
  features: string[];
  additionalServices: string[];
  totalPrice: number;
  projectDetails?: {
    industry?: string;
    description?: string;
    colorScheme?: string;
    referenceSites?: string[];
    logo?: boolean;
    copywriting?: boolean;
    photography?: boolean;
    deadline?: string;
    budget?: string;
    notes?: string;
  };
}

export default function Kalkulator() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [calculation, setCalculation] = useState<CalculationData>({
    packageType: 'basic',
    pages: 5,
    features: [],
    additionalServices: [],
    totalPrice: 0,
    projectDetails: {
      industry: '',
      description: '',
      colorScheme: '',
      referenceSites: [],
      logo: false,
      copywriting: false,
      photography: false,
      deadline: '',
      budget: '',
      notes: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white/80 border-gray-200';

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  const packages = {
    basic: {
      name: 'Strona Basic',
      price: 1500,
      description: 'Idealna dla małych firm i freelancerów',
      included: ['Responsywny design', '5 podstron', 'Formularz kontaktowy', 'SEO optymalizacja']
    },
    professional: {
      name: 'Strona Professional',
      price: 3000,
      description: 'Dla rozwijających się biznesów',
      included: ['Wszystko z Basic', '10 podstron', 'Panel CMS', 'Blog', 'Galeria', 'Integracja z mediami społecznościowymi']
    },
    premium: {
      name: 'Strona Premium',
      price: 5000,
      description: 'Zaawansowane rozwiązania dla dużych firm',
      included: ['Wszystko z Professional', 'Nieograniczona liczba podstron', 'Zaawansowany CMS', 'Sklep internetowy', 'System rezerwacji', 'Aplikacje webowe']
    }
  };

  const features = [
    { id: 'blog', name: 'Blog', price: 500 },
    { id: 'gallery', name: 'Galeria zdjęć', price: 300 },
    { id: 'contact-form', name: 'Zaawansowany formularz kontaktowy', price: 200 },
    { id: 'seo', name: 'Zaawansowana optymalizacja SEO', price: 800 },
    { id: 'analytics', name: 'Integracja z Google Analytics', price: 150 },
    { id: 'social', name: 'Integracja z mediami społecznościowymi', price: 250 },
    { id: 'newsletter', name: 'System newsletter', price: 400 },
    { id: 'chat', name: 'Live chat na stronie', price: 350 }
  ];

  const additionalServices = [
    { id: 'hosting', name: 'Hosting na pierwszy rok', price: 300 },
    { id: 'domain', name: 'Rejestracja domeny', price: 100 },
    { id: 'ssl', name: 'Certyfikat SSL', price: 150 },
    { id: 'maintenance', name: 'Pakiet serwisowy (12 miesięcy)', price: 1200 },
    { id: 'training', name: 'Szkolenie z obsługi panelu', price: 400 },
    { id: 'copywriting', name: 'Tresowanie tekstów', price: 800 }
  ];

  const calculatePrice = () => {
    let basePrice = packages[calculation.packageType].price;
    
    // Koszt dodatkowych podstron
    const basePages = calculation.packageType === 'basic' ? 5 : calculation.packageType === 'professional' ? 10 : 999;
    const extraPages = Math.max(0, calculation.pages - basePages);
    const pagesPrice = extraPages * 200;

    // Koszt wybranych funkcji
    const featuresPrice = calculation.features.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);

    // Koszt dodatkowych usług
    const servicesPrice = calculation.additionalServices.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);

    const totalPrice = basePrice + pagesPrice + featuresPrice + servicesPrice;

    setCalculation(prev => ({
      ...prev,
      totalPrice
    }));
  };

  useEffect(() => {
    calculatePrice();
  }, [calculation.packageType, calculation.pages, calculation.features, calculation.additionalServices]);

  const handlePackageChange = (packageType: 'basic' | 'professional' | 'premium') => {
    setCalculation(prev => ({
      ...prev,
      packageType,
      pages: packageType === 'basic' ? 5 : packageType === 'professional' ? 10 : 15
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setCalculation(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setCalculation(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(s => s !== serviceId)
        : [...prev.additionalServices, serviceId]
    }));
  };

  const buildOrderItems = () => {
    return [
      {
        name: packages[calculation.packageType].name,
        description: `Pakiet ${calculation.packageType} - ${calculation.pages} podstron`,
        quantity: 1,
        unitPrice: packages[calculation.packageType].price,
        totalPrice: packages[calculation.packageType].price
      },
      ...calculation.features.map(featureId => {
        const feature = features.find(f => f.id === featureId);
        return {
          name: feature?.name || '',
          description: 'Dodatkowa funkcja',
          quantity: 1,
          unitPrice: feature?.price || 0,
          totalPrice: feature?.price || 0
        };
      }),
      ...calculation.additionalServices.map(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        return {
          name: service?.name || '',
          description: 'Dodatkowa usługa',
          quantity: 1,
          unitPrice: service?.price || 0,
          totalPrice: service?.price || 0
        };
      })
    ];
  };

  const handleProceedContact = () => {
    const calculationData = {
      packageType: calculation.packageType,
      pages: calculation.pages,
      features: calculation.features.map(id => features.find(f => f.id === id)?.name).filter(Boolean),
      additionalServices: calculation.additionalServices.map(id => additionalServices.find(s => s.id === id)?.name).filter(Boolean),
      totalPrice: calculation.totalPrice
    };

    localStorage.setItem('kalkulatorData', JSON.stringify(calculationData));
    router.push('/kontakt');
  };

  const handleProceedPayment = () => {
    const orderItems = buildOrderItems();

    localStorage.setItem('kalkulatorOrder', JSON.stringify({
      orderItems,
      totalAmount: calculation.totalPrice,
      calculation
    }));

    if (session) {
      router.push('/panel/zamow');
      return;
    }

    const callbackUrl = encodeURIComponent('/panel/zamow');
    router.push(`/auth/signup?callbackUrl=${callbackUrl}`);
  };

  if (!mounted) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      <Head>
        <title>Kalkulator wyceny - Designstron</title>
        <meta name="description" content="Skalkuluj koszt swojej strony internetowej" />
      </Head>

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="kalkulator" />

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-black ${textPrimary}`}>
            Kalkulator
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-4">
              Wyceny
            </span>
          </h1>
          <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
            Skalkuluj koszt swojej idealnej strony internetowej w kilka minut
          </p>
        </div>

        {/* Progress indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span className={`ml-3 font-medium ${textPrimary}`}>Wybór pakietu</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">2</div>
              <span className={`ml-3 font-medium ${textSecondary}`}>Funkcje</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">3</div>
              <span className={`ml-3 font-medium ${textSecondary}`}>Usługi</span>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className={`text-2xl font-bold mb-8 ${textPrimary}`}>Wybierz pakiet</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(packages).map(([key, pkg]) => (
              <div
                key={key}
                onClick={() => handlePackageChange(key as 'basic' | 'professional' | 'premium')}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  calculation.packageType === key
                    ? 'border-blue-500 bg-blue-500/10'
                    : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {calculation.packageType === key && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Wybrano
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>{pkg.name}</h3>
                <div className={`text-3xl font-black mb-4 ${textPrimary}`}>
                  {pkg.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                </div>
                <p className={`mb-4 ${textSecondary}`}>{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.included.map((item, index) => (
                    <li key={index} className={`flex items-center ${textSecondary}`}>
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Pages Count */}
        <div className={`max-w-6xl mx-auto mb-12 p-6 rounded-2xl ${cardBg} border-2 ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
          <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Liczba podstron</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={calculation.packageType === 'basic' ? 1 : calculation.packageType === 'professional' ? 5 : 10}
              max={calculation.packageType === 'premium' ? 50 : 25}
              value={calculation.pages}
              onChange={(e) => setCalculation(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <div className={`text-2xl font-bold ${textPrimary} min-w-[60px] text-center`}>
              {calculation.pages}
            </div>
          </div>
          {calculation.pages > (calculation.packageType === 'basic' ? 5 : calculation.packageType === 'professional' ? 10 : 999) && (
            <p className={`mt-2 text-sm ${textSecondary}`}>
              Dodatkowe podstrony: +200 PLN/szt.
            </p>
          )}
        </div>

        {/* Features */}
        <div className={`max-w-6xl mx-auto mb-12 p-6 rounded-2xl ${cardBg} border-2 ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
          <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Dodatkowe funkcje</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map(feature => (
              <label key={feature.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={calculation.features.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className={`font-medium ${textPrimary}`}>{feature.name}</div>
                  <div className={`text-sm ${textSecondary}`}>+{feature.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className={`max-w-6xl mx-auto mb-12 p-6 rounded-2xl ${cardBg} border-2 ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
          <h3 className={`text-xl font-bold mb-4 ${textPrimary}`}>Dodatkowe usługi</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {additionalServices.map(service => (
              <label key={service.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={calculation.additionalServices.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className={`font-medium ${textPrimary}`}>{service.name}</div>
                  <div className={`text-sm ${textSecondary}`}>+{service.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className={`max-w-6xl mx-auto p-8 rounded-2xl ${cardBg} border-2 ${isDark ? 'border-slate-700' : 'border-gray-300'} mb-12`}>
          <h3 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Podsumowanie wyceny</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className={textSecondary}>Pakiet {packages[calculation.packageType].name}</span>
              <span className={textPrimary}>{packages[calculation.packageType].price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
            </div>
            {calculation.pages > (calculation.packageType === 'basic' ? 5 : calculation.packageType === 'professional' ? 10 : 999) && (
              <div className="flex justify-between">
                <span className={textSecondary}>Dodatkowe podstrony ({calculation.pages - (calculation.packageType === 'basic' ? 5 : calculation.packageType === 'professional' ? 10 : 999)})</span>
                <span className={textPrimary}>{((calculation.pages - (calculation.packageType === 'basic' ? 5 : calculation.packageType === 'professional' ? 10 : 999)) * 200).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
              </div>
            )}
            {calculation.features.map(featureId => {
              const feature = features.find(f => f.id === featureId);
              return (
                <div key={featureId} className="flex justify-between">
                  <span className={textSecondary}>{feature?.name}</span>
                  <span className={textPrimary}>{feature?.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                </div>
              );
            })}
            {calculation.additionalServices.map(serviceId => {
              const service = additionalServices.find(s => s.id === serviceId);
              return (
                <div key={serviceId} className="flex justify-between">
                  <span className={textSecondary}>{service?.name}</span>
                  <span className={textPrimary}>{service?.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className={`text-2xl font-bold ${textPrimary}`}>Całkowita kwota:</span>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {calculation.totalPrice.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleProceedContact}
              className="inline-block px-8 py-4 border-2 border-blue-500/50 text-blue-400 font-bold rounded-xl hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-105"
            >
              Wyślij zapytanie
            </button>
            <button
              onClick={handleProceedPayment}
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Przejdź do płatności
            </button>
          </div>
          {!session && (
            <p className={`mt-4 ${textSecondary}`}>
              Jeśli nie masz konta, zostaniesz przekierowany do rejestracji, a potem wrócisz do koszyka.
            </p>
          )}
        </div>

        {/* Project Details Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className={`text-2xl font-bold mb-8 ${textPrimary}`}>Szczegóły projektu</h2>
          <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Branża *
                </label>
                <input
                  type="text"
                  value={calculation.projectDetails?.industry || ''}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      industry: e.target.value
                    }
                  }))}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                  placeholder="np. IT, e-commerce, usługi"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Kolorystyka *
                </label>
                <input
                  type="text"
                  value={calculation.projectDetails?.colorScheme || ''}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      colorScheme: e.target.value
                    }
                  }))}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                  placeholder="np. niebiesko-biała, minimalistyczna"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Termin realizacji *
                </label>
                <input
                  type="text"
                  value={calculation.projectDetails?.deadline || ''}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      deadline: e.target.value
                    }
                  }))}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                  placeholder="np. 2 tygodnie, 1 miesiąc"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Budżet *
                </label>
                <input
                  type="text"
                  value={calculation.projectDetails?.budget || ''}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      budget: e.target.value
                    }
                  }))}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                  placeholder="np. 5000-8000 zł"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                Opis projektu *
              </label>
              <textarea
                value={calculation.projectDetails?.description || ''}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  projectDetails: {
                    ...prev.projectDetails!,
                    description: e.target.value
                  }
                }))}
                rows={4}
                className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                placeholder="Opisz swój projekt, cele i oczekiwania..."
                required
              />
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                Przykładowe strony
              </label>
              <input
                type="text"
                value={calculation.projectDetails?.referenceSites?.join(', ') || ''}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  projectDetails: {
                    ...prev.projectDetails!,
                    referenceSites: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))}
                className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                placeholder="Wpisz URL-e oddzielone przecinkami"
              />
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                Dodatkowe uwagi
              </label>
              <textarea
                value={calculation.projectDetails?.notes || ''}
                onChange={(e) => setCalculation(prev => ({
                  ...prev,
                  projectDetails: {
                    ...prev.projectDetails!,
                    notes: e.target.value
                  }
                }))}
                rows={3}
                className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                placeholder="Dodatkowe informacje lub wymagania..."
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`flex items-center space-x-3 cursor-pointer ${textPrimary}`}>
                <input
                  type="checkbox"
                  checked={calculation.projectDetails?.logo || false}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      logo: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Potrzebuję logo</span>
              </label>

              <label className={`flex items-center space-x-3 cursor-pointer ${textPrimary}`}>
                <input
                  type="checkbox"
                  checked={calculation.projectDetails?.copywriting || false}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      copywriting: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Potrzebuję tekstów</span>
              </label>

              <label className={`flex items-center space-x-3 cursor-pointer ${textPrimary}`}>
                <input
                  type="checkbox"
                  checked={calculation.projectDetails?.photography || false}
                  onChange={(e) => setCalculation(prev => ({
                    ...prev,
                    projectDetails: {
                      ...prev.projectDetails!,
                      photography: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Potrzebuję zdjęć</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
