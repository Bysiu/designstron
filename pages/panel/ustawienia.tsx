'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavbarAuth from '@/components/NavbarAuth';

export default function UserSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    if (session) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || ''
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Walidacja haseł
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('Nowe hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage('Nowe hasło musi mieć co najmniej 6 znaków');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Ustawienia zostały zaktualizowane');
        // Czyść pola haseł
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setMessage(data.message || 'Wystąpił błąd podczas aktualizacji ustawień');
      }
    } catch (error) {
      setMessage('Wystąpił błąd serwera');
    } finally {
      setIsLoading(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Ustawienia <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">profilu</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Zarządzaj swoimi danymi osobowymi i hasłem</p>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informacje podstawowe */}
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Informacje podstawowe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Imię i nazwisko
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="Jan Kowalski"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="twoj@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Zmiana hasła */}
              <div className="border-t border-gray-300/50 pt-8">
                <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Zmiana hasła</h2>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Obecne hasło
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Nowe hasło
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <p className={`${textSecondary} text-sm mt-2`}>Minimum 6 znaków</p>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${textPrimary}`}>
                      Potwierdź nowe hasło
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Komunikat */}
              {message && (
                <div className={`p-4 rounded-xl border-2 ${
                  message.includes('błąd') || message.includes('nie')
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  {message}
                </div>
              )}

              {/* Przyciski */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/panel"
                  className={`px-6 py-3 border-2 border-gray-300/50 rounded-xl ${isDark ? 'text-gray-300 hover:bg-gray-800/50' : 'text-gray-700 hover:bg-gray-100'} transition-all duration-300`}
                >
                  Anuluj
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          </div>

          {/* Sekcja niebezpieczeństwa */}
          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-8 mt-8 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
            <h2 className={`text-2xl font-bold mb-6 ${textPrimary}`}>Niebezpieczeństwo</h2>
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 border-red-500/30 bg-red-500/10`}>
                <h3 className={`font-bold text-lg mb-2 text-red-400`}>Usuń konto</h3>
                <p className={`${textSecondary} text-sm mb-4`}>
                  Usunięcie konta jest nieodwracalne. Wszystkie Twoje zamówienia i dane zostaną trwale usunięte.
                </p>
                <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]">
                  Usuń konto
                </button>
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
      `}</style>
    </div>
  );
}
