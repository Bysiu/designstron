'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DesignStron.pl
              </Link>
              <span className="ml-4 text-sm text-gray-500">Panel Administratora</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/panel" className="text-gray-600 hover:text-gray-900">
                Panel klienta
              </Link>
              <span className="text-gray-900 font-medium">Admin</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administratora</h1>
          <p className="text-gray-600">Zarządzanie zamówieniami i klientami</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`bg-white rounded-lg shadow p-4 text-left transition-all ${
              filter === 'all' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-600">Wszystkie</p>
            <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
          </button>

          <button
            onClick={() => setFilter('PENDING')}
            className={`bg-white rounded-lg shadow p-4 text-left transition-all ${
              filter === 'PENDING' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-600">Oczekujące</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </button>

          <button
            onClick={() => setFilter('PAID')}
            className={`bg-white rounded-lg shadow p-4 text-left transition-all ${
              filter === 'PAID' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-600">Opłacone</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </button>

          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`bg-white rounded-lg shadow p-4 text-left transition-all ${
              filter === 'IN_PROGRESS' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-600">W realizacji</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </button>

          <button
            onClick={() => setFilter('COMPLETED')}
            className={`bg-white rounded-lg shadow p-4 text-left transition-all ${
              filter === 'COMPLETED' ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-600">Zakończone</p>
            <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Zamówienia {filter !== 'all' && `(${getStatusText(filter)})`}
            </h2>
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
                <thead className="bg-gray-50">
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.user.name || order.user.email}
                          </p>
                          <p className="text-sm text-gray-500">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.messages.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link href={`/admin/zamowienie/${order.id}`} className="text-blue-600 hover:text-blue-900">
                            Szczegóły
                          </Link>
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'IN_PROGRESS', 'Rozpoczęto realizację zamówienia')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Rozpocznij
                            </button>
                          )}
                          {order.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'COMPLETED', 'Zamówienie zakończone')}
                              className="text-purple-600 hover:text-purple-900"
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
      </main>
    </div>
  );
}
