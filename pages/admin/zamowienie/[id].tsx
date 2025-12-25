
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';

interface Message {
  id: string;
  content: string;
  sender: 'USER' | 'ADMIN';
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerPhone?: string | null;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  messages: Message[];
  statusHistory: {
    status: string;
    comment: string;
    createdAt: string;
  }[];
}

export default function AdminOrderDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDark] = useState(true);
  const noopSetIsDark = () => {};
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (id && session?.user.role === 'ADMIN') {
      fetchOrder();
    }
  }, [id, session]);

  useEffect(() => {
    scrollToBottom();
  }, [order?.messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else if (response.status === 404) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Błąd pobierania zamówienia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          sender: 'ADMIN'
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchOrder();
      }
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
    } finally {
      setIsSending(false);
    }
  };

  const updateStatus = async (newStatus: string, comment?: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          comment
        }),
      });

      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Błąd aktualizacji statusu:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/30';
      case 'PAID':
        return 'bg-green-500/15 text-green-200 border border-green-500/30';
      case 'IN_PROGRESS':
        return 'bg-blue-500/15 text-blue-200 border border-blue-500/30';
      case 'COMPLETED':
        return 'bg-purple-500/15 text-purple-200 border border-purple-500/30';
      case 'CANCELLED':
        return 'bg-red-500/15 text-red-200 border border-red-500/30';
      default:
        return 'bg-slate-500/15 text-slate-200 border border-slate-500/30';
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN' || !order) {
    return null;
  }

  const bgClass = 'bg-slate-950 text-white';
  const cardBg = 'bg-slate-900/50 border-slate-800';
  const textSecondary = 'text-gray-400';
  const textPrimary = 'text-white';

  return (
    <div data-theme={isDark ? 'dark' : 'light'} className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
      <Head>
        <title>Szczegóły zamówienia - Admin</title>
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
          <div className="mb-6">
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrót do listy zamówień
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Szczegóły zamówienia */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                    Zamówienie #{order.id.slice(-8)}
                  </h1>
                  <div className="space-y-1">
                    <p className={textSecondary}>
                      Klient: {order.user.name || order.user.email}
                    </p>
                    <p className={textSecondary}>
                      Email: {order.user.email}
                    </p>
                    {order.customerPhone && (
                      <p className={textSecondary}>
                        Telefon: {order.customerPhone}
                      </p>
                    )}
                    <p className={textSecondary}>
                      Data zamówienia: {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  
                  {/* Akcje statusu */}
                  <div className="mt-3 space-y-2">
                    {order.status === 'PAID' && (
                      <button
                        onClick={() => {
                          if (!confirmTwice('Rozpocznij realizację')) return;
                          updateStatus('IN_PROGRESS', 'Rozpoczęto realizację zamówienia');
                        }}
                        disabled={isUpdatingStatus}
                        className="block w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Rozpocznij realizację
                      </button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => {
                          if (!confirmTwice('Zakończ zamówienie')) return;
                          updateStatus('COMPLETED', 'Zamówienie zakończone');
                        }}
                        disabled={isUpdatingStatus}
                        className="block w-full bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                      >
                        Zakończ zamówienie
                      </button>
                    )}
                    {(order.status === 'PENDING' || order.status === 'PAID') && (
                      <button
                        onClick={() => updateStatus('CANCELLED', 'Zamówienie anulowane')}
                        disabled={isUpdatingStatus}
                        className="block w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        Anuluj zamówienie
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className={`text-lg font-semibold ${textPrimary}`}>Szczegóły zamówienia</h2>
                {order.orderItems.map((item, index) => (
                  <div key={index} className={`${isDark ? 'border-slate-800' : 'border-gray-200'} border-b pb-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${textPrimary}`}>{item.name}</h3>
                        <p className={`text-sm ${textSecondary}`}>{item.description}</p>
                        <p className={`text-sm ${textSecondary}`}>Ilość: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${textPrimary}`}>
                          {item.totalPrice.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          {item.unitPrice.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })} / szt.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className={`${isDark ? 'border-slate-800' : 'border-gray-200'} border-t pt-4`}>
                  <div className="flex justify-between text-lg font-bold">
                    <span className={textPrimary}>Suma całkowita:</span>
                    <span className="text-blue-400">
                      {order.totalAmount.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historia statusu */}
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-6`}>
              <h2 className={`text-lg font-semibold ${textPrimary} mb-4`}>Historia statusu</h2>
              <div className="space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      history.status === 'COMPLETED' ? 'bg-green-500' :
                      history.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                      history.status === 'PAID' ? 'bg-green-500' :
                      history.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${textPrimary}`}>
                          {getStatusText(history.status)}
                        </span>
                        <span className={`text-sm ${textSecondary}`}>
                          {new Date(history.createdAt).toLocaleDateString('pl-PL')} {new Date(history.createdAt).toLocaleTimeString('pl-PL')}
                        </span>
                      </div>
                      {history.comment && (
                        <p className={`text-sm ${textSecondary} mt-1`}>{history.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl border h-[600px] flex flex-col overflow-hidden`}>
              <div className={`${isDark ? 'border-slate-800' : 'border-gray-200'} p-4 border-b`}>
                <h2 className={`text-lg font-semibold ${textPrimary}`}>Wiadomości</h2>
                <p className={`text-sm ${textSecondary}`}>Komunikacja z klientem</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {order.messages.length === 0 ? (
                  <div className={`text-center ${textSecondary} py-8`}>
                    <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Brak wiadomości. Rozpocznij rozmowę z klientem!</p>
                  </div>
                ) : (
                  order.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'ADMIN'
                            ? 'bg-blue-600 text-white'
                            : isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'ADMIN' ? 'text-blue-100' : isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString('pl-PL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className={`${isDark ? 'border-slate-800' : 'border-gray-200'} p-4 border-t`}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Napisz wiadomość do klienta..."
                    className={`flex-1 px-3 py-2 border-2 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${
                      isDark ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
