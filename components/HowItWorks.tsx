'use client';

import { useState, useEffect } from 'react';

interface HowItWorksProps {
  className?: string;
  isDark?: boolean;
}

export default function HowItWorks({ className = '', isDark = false }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const steps = [
    {
      number: 1,
      title: 'Wybierz pakiet',
      description: 'Skorzystaj z naszego zaawansowanego kalkulatora, aby dopasować idealny pakiet do Twoich unikalnych potrzeb biznesowych',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      features: ['Interaktywny kalkulator wyceny', '3 elastyczne pakiety', 'Pełna personalizacja', 'Porównanie funkcji']
    },
    {
      number: 2,
      title: 'Zarejestruj się',
      description: 'Załóż bezpieczne konto w mniej niż minutę i uzyskaj dostęp do panelu zarządzania projektami',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      features: ['Rejestracja w 60 sekund', 'Logowanie przez Google/Facebook', 'Szyfrowanie danych', 'Weryfikacja dwuskładnikowa']
    },
    {
      number: 3,
      title: 'Dokonaj płatności',
      description: 'Bezpieczna płatność online z możliwością ratalną i natychmiastowym potwierdzeniem transakcji',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      features: ['Przelew bankowy', 'Płatność kartą', 'BLIK i szybkie przelewy', 'Raty 0%']
    },
    {
      number: 4,
      title: 'Śledź postęp',
      description: 'Monitoruj każdy etap realizacji w czasie rzeczywistym z dostępem do kamieni milowych projektu',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: ['Dashboard w czasie rzeczywistym', 'Powiadomienia push & email', 'Kamienie milowe', 'Bezpośredni kontakt z zespołem']
    },
    {
      number: 5,
      title: 'Odbierz stronę',
      description: 'Otrzymaj w pełni zoptymalizowaną stronę z dokumentacją, wsparciem i gwarancją jakości',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: ['Produkt gotowy do użycia', 'Dokumentacja techniczna', 'Szkolenie z obsługi', 'Gwarancja 12 miesięcy']
    }
  ];

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' 
    : 'bg-white/60 backdrop-blur-xl border-white/20';

  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className={`relative py-16 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <span className="text-xs font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prosty proces w 5 krokach
            </span>
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${textPrimary}`}>
            Jak to{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              działa
            </span>
            ?
          </h2>
          <p className={`text-base ${textSecondary} max-w-2xl mx-auto`}>
            Od pierwszego kontaktu do uruchomienia strony - transparentny proces
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative mb-10">
          {/* Connection Line */}
          <div className={`hidden lg:block absolute top-6 left-0 right-0 h-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative cursor-pointer transition-all duration-300 ${
                  activeStep === index ? 'transform scale-105' : ''
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Circle */}
                <div className="relative">
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl mx-auto mb-2 md:mb-3 transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : activeStep > index
                        ? isDark
                          ? 'bg-slate-700 text-green-400 border-2 border-green-400/30'
                          : 'bg-green-50 text-green-600 border-2 border-green-200'
                        : isDark 
                          ? 'bg-slate-800/80 text-slate-400 border-2 border-slate-700'
                          : 'bg-white text-slate-500 border-2 border-slate-200'
                  }`}>
                    {activeStep > index ? (
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm md:text-lg font-bold">{step.number}</span>
                    )}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className={`text-center font-semibold text-xs md:text-sm transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent' 
                    : textPrimary
                }`}>
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Details Card */}
        <div className={`${cardBg} rounded-3xl border shadow-2xl p-8 md:p-12 transition-all duration-500 ${
          isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-blue-400' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600'
                }`}>
                  {steps[activeStep].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      Krok {activeStep + 1}/{steps.length}
                    </span>
                    <span className={`text-sm ${textSecondary}`}>
                      • {['5 min', '2 min', '5 min', '3-7 dni', '1 dzień'][activeStep]}
                    </span>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-black mb-4 ${textPrimary}`}>
                    {steps[activeStep].title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${textSecondary}`}>
                    {steps[activeStep].description}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {steps[activeStep].features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark 
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' 
                        : 'bg-gradient-to-br from-green-100 to-emerald-100'
                    }`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className={`font-medium ${textPrimary}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className={`relative ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-100'
              } rounded-3xl p-12 border ${isDark ? 'border-slate-700/50' : 'border-white/50'}`}>
                {/* Center Circle with Number */}
                <div className="relative">
                  <div className={`w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                      : 'bg-white'
                  }`}>
                    <div className="text-7xl font-black bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {steps[activeStep].number}
                    </div>
                  </div>

                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${
                      isDark ? 'bg-blue-500' : 'bg-blue-400'
                    } shadow-lg`} />
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${
                      isDark ? 'bg-purple-500' : 'bg-purple-400'
                    } shadow-lg`} />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className={`h-4 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-medium ${textSecondary}`}>
                      Postęp realizacji
                    </p>
                    <p className={`text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
                      {Math.round(((activeStep + 1) / steps.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className={`flex justify-between items-center mt-12 pt-8 border-t ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeStep === 0
                  ? isDark
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:scale-105 shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 shadow-lg'
              }`}
            >
              <svg className={`w-5 h-5 transition-transform ${activeStep !== 0 && 'group-hover:-translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Wstecz
            </button>

            {/* Step Indicators */}
            <div className="flex gap-3">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`transition-all duration-300 rounded-full ${
                    activeStep === index
                      ? 'w-12 h-4 bg-gradient-to-r from-blue-500 to-purple-500'
                      : isDark
                        ? 'w-4 h-4 bg-slate-700 hover:bg-slate-600'
                        : 'w-4 h-4 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (activeStep === steps.length - 1) {
                  // Przekieruj do rejestracji lub zalogowania
                  window.location.assign('/auth/signin');
                } else {
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1));
                }
              }}
              className={`group flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeStep === steps.length - 1
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg shadow-purple-500/30'
              }`}
            >
              {activeStep === steps.length - 1 ? 'Zamów stronę' : 'Dalej'}
              <svg className={`w-5 h-5 transition-transform ${activeStep !== steps.length - 1 && 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-20 text-center p-12 rounded-3xl ${cardBg} border shadow-xl`}>
          <h3 className={`text-3xl font-bold mb-4 ${textPrimary}`}>
            Gotowy na rozpoczęcie współpracy?
          </h3>
          <p className={`text-lg ${textSecondary} mb-8 max-w-2xl mx-auto`}>
            Dołącz do setek zadowolonych klientów i zrealizuj projekt swoich marzeń
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/kalkulator"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-110 shadow-2xl shadow-purple-500/50"
            >
              Rozpocznij teraz
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/kontakt"
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                isDark
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg'
              }`}
            >
              Porozmawiajmy
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}