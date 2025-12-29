'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';

export default function ExtendHostingCancelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (id) {
      fetchOrderDetails();
    }
  }, [status, id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = e.target as Element;
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false);
        }
      }
    };

    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Błąd pobierania zamówienia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  const bgClass = isDark ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  const cardBg = isDark ? 'bg-slate-900/50 backdrop-blur-xl border-slate-800' : 'bg-white/80 backdrop-blur-xl border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      <Head>
        <title>Przedłużenie hostingu - Anulowano - DesignStron</title>
      </Head>
      
      <div className={`min-h-screen ${bgClass}`}>
        {/* Navbar */}
        <nav className={`${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border-b sticky top-0 z-50`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/panel" className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">DS</span>
                  </div>
                  <span className={`font-bold text-xl ${textPrimary}`}>DesignStron</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/panel"
                  className={`px-4 py-2 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-all`}
                >
                  Panel
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
                        <p className="text-sm font-medium">{session?.user?.name || 'Użytkownik'}</p>
                        <p className="text-xs opacity-75">{session?.user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/auth/signout" className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
                          Wyloguj się
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Anulowano */}
          <div className="max-w-2xl mx-auto">
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-8 text-center`}>
              {/* Ikona anulowania */}
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className={`text-3xl font-black mb-4 ${textPrimary}`}>Płatność anulowana</h1>
              <p className={`${textSecondary} mb-8`}>
                Twoja płatność za przedłużenie hostingu została anulowana. Możesz spróbować ponownie w dowolnym momencie.
              </p>

              {/* Przyciski */}
              <div className="space-y-4">
                <Link
                  href={`/panel/hosting/${id}/extend`}
                  className={`block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]`}
                >
                  Spróbuj ponownie
                </Link>
                
                <Link
                  href={`/panel/hosting/${id}`}
                  className={`block w-full px-6 py-4 border-2 ${isDark ? 'border-slate-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-xl font-medium hover:bg-gray-100 transition-all`}
                >
                  Powrót do hostingu
                </Link>
                
                <Link
                  href="/panel"
                  className={`block w-full px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-400 transition-colors`}
                >
                  Powrót do panelu
                </Link>
              </div>

              {/* Informacja */}
              <div className={`mt-8 p-4 rounded-lg ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border`}>
                <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  <strong>Uwaga:</strong> Jeśli anulowanie było przypadkowe, Twój hosting nie został przedłużony. Możesz spróbować ponownie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
