
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: {
    name: string;
    quantity: number;
    totalPrice: number;
  }[];
  messages: {
    id: string;
    content: string;
    sender: string;
    createdAt: string;
  }[];
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [isDark] = useState(true);
  const noopSetIsDark = () => {};
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const confirmTwice = (label: string) => {
    const first = window.confirm(`Czy na pewno chcesz wykonać akcję: ${label}?`);
    if (!first) return false;
    const second = window.confirm(`Potwierdź ponownie: ${label}`);
    return second;
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/panel');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchOrders();
    }
  }, [session, filter]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/admin/orders?status=${filter}`);
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

  const updateOrderStatus = async (orderId: string, newStatus: string, comment?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, comment }),
      });

      if (response.ok) {
        fetchOrders(); // Odśwież listę zamówień
      }
    } catch (error) {
      console.error('Błąd aktualizacji statusu:', error);
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

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    paid: orders.filter(o => o.status === 'PAID').length,
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
  };

  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white/80 border-gray-200';

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div data-theme={isDark ? 'dark' : 'light'} className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
      <Head>
        <title>Panel admina - Designstron</title>
      </Head>

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
      </div>

      <NavbarAuth isDark={isDark} setIsDark={noopSetIsDark} currentPage="admin" />

      <main className="relative pt-32 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
          <h1 className={`text-3xl sm:text-4xl font-black ${textPrimary}`}>
            Panel Administratora
          </h1>
          <p className={`${textSecondary} mt-2`}>
            Zarządzanie zamówieniami i klientami
          </p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 text-left transition-all ${
              filter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className={`text-sm ${textSecondary}`}>Wszystkie</p>
              <p className={`text-3xl font-black ${textPrimary} mt-1`}>{stats.all}</p>
            </div>
          </button>

          <button
            onClick={() => setFilter('PENDING')}
            className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 text-left transition-all ${
              filter === 'PENDING' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className={`text-sm ${textSecondary}`}>Oczekujące</p>
              <p className="text-3xl font-black text-yellow-700 mt-1">{stats.pending}</p>
            </div>
          </button>

          <button
            onClick={() => setFilter('PAID')}
            className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 text-left transition-all ${
              filter === 'PAID' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className={`text-sm ${textSecondary}`}>Opłacone</p>
              <p className="text-3xl font-black text-green-700 mt-1">{stats.paid}</p>
            </div>
          </button>

          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 text-left transition-all ${
              filter === 'IN_PROGRESS' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className={`text-sm ${textSecondary}`}>W realizacji</p>
              <p className="text-3xl font-black text-blue-700 mt-1">{stats.inProgress}</p>
            </div>
          </button>

          <button
            onClick={() => setFilter('COMPLETED')}
            className={`group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 text-left transition-all ${
              filter === 'COMPLETED' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className={`text-sm ${textSecondary}`}>Zakończone</p>
              <p className="text-3xl font-black text-purple-700 mt-1">{stats.completed}</p>
            </div>
          </button>
        </div>

        {/* Orders Table */}
        <div className={`${cardBg} backdrop-blur-sm rounded-2xl border shadow-xl shadow-blue-500/5 overflow-hidden`}>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-bold ${textPrimary}`}>
                Zamówienia {filter !== 'all' && `(${getStatusText(filter)})`}
              </h2>
              <p className={`text-sm ${textSecondary} mt-1`}>
                Szybki podgląd i zarządzanie statusami
              </p>
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zamówień</h3>
              <p className="text-gray-600">Nie ma zamówień o statusie "{getStatusText(filter)}"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zamówienie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kwota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wiadomości
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-transparent divide-slate-800' : 'bg-white divide-gray-200'} divide-y`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/70'} transition-colors`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textPrimary}`}>
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className={`text-sm font-medium ${textPrimary}`}>
                            {order.user.name || order.user.email}
                          </p>
                          <p className={`text-sm ${textSecondary}`}>{order.user.email}</p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textPrimary}`}>
                        {order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSecondary}`}>
                        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {order.messages.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/zamowienie/${order.id}`} className="text-blue-600 hover:text-blue-900 font-semibold">
                            Szczegóły
                          </Link>
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => {
                                if (!confirmTwice('Rozpocznij realizację')) return;
                                updateOrderStatus(order.id, 'IN_PROGRESS', 'Rozpoczęto realizację zamówienia');
                              }}
                              className="text-green-700 hover:text-green-900 font-semibold"
                            >
                              Rozpocznij
                            </button>
                          )}
                          {order.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => {
                                if (!confirmTwice('Zakończ zamówienie')) return;
                                updateOrderStatus(order.id, 'COMPLETED', 'Zamówienie zakończone');
                              }}
                              className="text-purple-700 hover:text-purple-900 font-semibold"
                            >
                              Zakończ
                            </button>
                          )}
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
      </main>
    </div>
  );
}
