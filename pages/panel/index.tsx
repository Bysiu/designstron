'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
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

export default function Panel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Panel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">klienta</span>
            </h1>
            <p className={`${textSecondary} text-lg`}>Witaj, {session.user?.name || session.user?.email}!</p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`${textSecondary} text-sm`}>Wszystkie zamówienia</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{orders.length}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-green-500/20' : 'bg-green-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className={`p-3 ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-xl`}>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        </div>

        {/* Orders Table */}
        <div className={`${cardBg} backdrop-blur-xl rounded-2xl border animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-gray-300/50">
            <h2 className={`text-xl font-bold ${textPrimary}`}>Twoje zamówienia</h2>
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
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Numer zamówienia
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Data
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Kwota
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-slate-900/50' : 'bg-white'} divide-y divide-gray-300/50`}>
                  {orders.map((order) => (
                    <tr key={order.id} className={`hover:${isDark ? 'bg-slate-800/30' : 'bg-gray-50'} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${textPrimary}`}>
                        #{order.id.slice(-8)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${textPrimary}`}>
                        {order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/panel/zamowienie/${order.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                          Szczegóły
                        </Link>
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
