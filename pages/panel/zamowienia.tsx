'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import OrderProgress from '@/components/OrderProgress';
import NotificationCenter from '@/components/NotificationCenter';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  // Informacje o hostingu
  hostingPlan?: 'basic' | 'premium' | null;
  hostingExpiresAt?: string | null;
  domain?: string | null;
  ssl?: boolean;
  orderItems: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  statusHistory: {
    status: string;
    comment: string;
    createdAt: string;
  }[];
}

export default function Zamowienia() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionType = (order: Order) => {
    if (order.hostingPlan) {
      if (order.orderItems.some(item => item.name.includes('Upgrade') || item.name.includes('zmian'))) {
        return 'Zmiana planu hostingu';
      } else if (order.orderItems.some(item => item.name.includes('Przedłużenie'))) {
        return 'Przedłużenie hostingu';
      } else {
        return 'Aktywacja hostingu';
      }
    } else {
      return 'Zamówienie strony';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Oczekuje na płatność';
      case 'PAID':
        return 'Opłacone';
      case 'IN_PROGRESS':
        return 'W realizacji';
      case 'COMPLETED':
        return 'Zakończone';
      case 'CANCELLED':
        return 'Anulowane';
      default:
        return status;
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

  if (status === 'loading' || isLoading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className={`mt-4 ${textSecondary}`}>Ładowanie...</p>
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
              id="order-button"
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
                    
                    <Link
                      href="/panel/zamowienia"
                      className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-slate-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Twoje zamówienia
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
                <Link
                  href="/panel/zamowienia"
                  className={`block py-3 px-4 rounded-lg ${isDark ? 'text-gray-300 hover:text-white hover:bg-slate-800/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Twoje zamówienia
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Twoje <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">zamówienia</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Zarządzaj wszystkimi swoimi zamówieniami w jednym miejscu.</p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Wszystkie</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{orders.length}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Oczekujące</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {orders.filter(o => o.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-green-500/20' : 'bg-green-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Opłacone</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {orders.filter(o => o.status === 'PAID').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>W realizacji</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {orders.filter(o => o.status === 'IN_PROGRESS').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Zakończone</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {orders.filter(o => o.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-red-500/20' : 'bg-red-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Anulowane</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>
                  {orders.filter(o => o.status === 'CANCELLED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div id="orders-section" className={`${cardBg} backdrop-blur-xl rounded-2xl border animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-gray-300/50">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Historia zamówień</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <div className={`w-16 h-16 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>Brak zamówień</h3>
              <p className={`${textSecondary} mb-4`}>Nie masz jeszcze żadnych zamówień.</p>
              <Link href="/panel/zamow" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]">
                Zamów pierwszą stronę
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300/50">
                <thead className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Zamówienie
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Data
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Kwota
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} divide-y divide-gray-300/50`}>
                  {orders.map((order) => (
                    <tr key={order.id} className={`hover:${isDark ? 'bg-slate-800/30' : 'bg-gray-50'} transition-colors`}>
                      <td className={`px-4 py-4 whitespace-nowrap`}>
                        <div>
                          <div className={`text-sm font-bold ${textPrimary}`}>
                            #{order.id.slice(-8)}
                          </div>
                          <div className={`text-xs ${textSecondary}`}>
                            {getTransactionType(order)}
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                        <div>
                          <div>{new Date(order.createdAt).toLocaleDateString('pl-PL')}</div>
                          <div className={`text-xs ${textSecondary}`}>
                            {new Date(order.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap`}>
                        <div className={`text-sm font-bold ${textPrimary}`}>
                          {order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
