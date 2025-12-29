'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NotificationCenter from '@/components/NotificationCenter';

export default function NotificationSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    newMessages: true,
    promotions: false,
    newsletter: true,
    securityAlerts: true,
    systemUpdates: false
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

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationSettings),
      });

      if (response.ok) {
        setMessage('Ustawienia powiadomień zostały zapisane pomyślnie!');
      } else {
        throw new Error('Wystąpił błąd podczas zapisywania ustawień');
      }
    } catch (error) {
      setMessage('Wystąpił błąd podczas zapisywania ustawień. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const cardBg = isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';

  return (
    <>
      <Head>
        <title>Ustawienia powiadomień - DesignStron.pl</title>
        <meta name="description" content="Zarządzaj ustawieniami powiadomień w panelu DesignStron.pl" />
      </Head>

      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-gray-50 to-blue-50'} overflow-hidden transition-colors duration-500 relative`}>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
                Ustawienia <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">powiadomień</span>
              </h1>
              <p className={`${textSecondary} text-lg`}>
                Zarządzaj preferencjami powiadomień, aby otrzymywać tylko te informacje, które są dla Ciebie ważne.
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('pomyślnie') ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'} border`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className={`${cardBg} rounded-xl p-6 border ${borderColor}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Powiadomienia email</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Powiadomienia email</p>
                      <p className={`${textSecondary} text-sm`}>Otrzymuj powiadomienia na adres email</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('emailNotifications', !notificationSettings.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div className={`${cardBg} rounded-xl p-6 border ${borderColor}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Powiadomienia push</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Powiadomienia push</p>
                      <p className={`${textSecondary} text-sm`}>Otrzymuj powiadomienia w przeglądarce</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('pushNotifications', !notificationSettings.pushNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.pushNotifications ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className={`${cardBg} rounded-xl p-6 border ${borderColor}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textPrimary}`}>Typy powiadomień</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Aktualizacje zamówień</p>
                      <p className={`${textSecondary} text-sm`}>Informacje o statusie Twoich zamówień</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('orderUpdates', !notificationSettings.orderUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.orderUpdates ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Nowe wiadomości</p>
                      <p className={`${textSecondary} text-sm`}>Powiadomienia o nowych wiadomościach</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('newMessages', !notificationSettings.newMessages)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.newMessages ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.newMessages ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Promocje i oferty</p>
                      <p className={`${textSecondary} text-sm`}>Informacje o promocjach i specjalnych ofertach</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('promotions', !notificationSettings.promotions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.promotions ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.promotions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Newsletter</p>
                      <p className={`${textSecondary} text-sm`}>Nasz cotygodniowy newsletter z nowościami</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('newsletter', !notificationSettings.newsletter)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.newsletter ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.newsletter ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Alerty bezpieczeństwa</p>
                      <p className={`${textSecondary} text-sm`}>Ważne informacje o bezpieczeństwie konta</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('securityAlerts', !notificationSettings.securityAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.securityAlerts ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${textPrimary} font-medium`}>Aktualizacje systemu</p>
                      <p className={`${textSecondary} text-sm`}>Informacje o aktualizacjach i nowych funkcjach</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('systemUpdates', !notificationSettings.systemUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.systemUpdates ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}