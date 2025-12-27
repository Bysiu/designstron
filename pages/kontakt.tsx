'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NavbarAuth from '@/components/NavbarAuth';

export default function Kontakt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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
    // Sprawdź czy są dane z kalkulatora
    const kalkulatorData = localStorage.getItem('kalkulatorData');
    if (kalkulatorData) {
      const data = JSON.parse(kalkulatorData);
      setFormData(prev => ({
        ...prev,
        subject: `Zapytanie o stronę ${data.packageType} - ${data.totalPrice.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}`,
        message: `Szanowni Państwo,\n\nJestem zainteresowany/a stroną internetową w pakiecie ${data.packageType}.\n\nSzczegóły:\n- Pakiet: ${data.packageType}\n- Liczba podstron: ${data.pages}\n- Funkcje: ${data.features.join(', ')}\n- Dodatkowe usługi: ${data.additionalServices.join(', ')}\n- Szacowana kwota: ${data.totalPrice.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}\n\nProszę o kontakt w celu omówienia szczegółów.\n\nZ pozdrowieniami`
      }));
      // Wyczyść dane z localStorage
      localStorage.removeItem('kalkulatorData');
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Formularz został wysłany pomyślnie! Skontaktujemy się z Tobą wkrótce.');
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Wystąpił błąd');
      }
    } catch (error: any) {
      console.error('Błąd wysyłania formularza:', error);
      alert(error.message || 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
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
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${textSecondary}`}>Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-theme={isDark ? 'dark' : 'light'} className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
      <Head>
        <title>Kontakt - Designstron</title>
        <meta name="description" content="Skontaktuj się z nami" />
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

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="kontakt" />

      {/* Main Content */}
      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Kontakt</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Masz pytania? Skontaktuj się z nami!</p>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white text-black border-gray-300' : 'bg-white text-black border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                    Temat *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white text-black border-gray-300' : 'bg-white text-black border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                    required
                  >
                    <option value="">Wybierz temat</option>
                    <option value="zapytanie">Zapytanie o ofertę</option>
                    <option value="zamowienie">Pytanie o zamówienie</option>
                    <option value="techniczne">Wsparcie techniczne</option>
                    <option value="wspolpraca">Współpraca</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                  Wiadomość *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                  placeholder="Opisz swoją sprawę..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>

            <div className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
              <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Inne sposoby kontaktu</h3>
              <div className="space-y-2">
                <p className={`${textSecondary}`}>
                  <strong>Email:</strong> kontakt@designstron.pl
                </p>
                <p className={`${textSecondary}`}>
                  <strong>Telefon:</strong> +48 123 456 789
                </p>
                <p className={`${textSecondary}`}>
                  <strong>Godziny pracy:</strong> Pon-Pt 9:00-17:00
                </p>
              </div>
            </div>
          </div>
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
      `}</style>
    </div>
  );
}
