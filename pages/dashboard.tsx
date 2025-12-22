import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NavbarAuth from '@/components/NavbarAuth';
import { prisma } from '@/lib/prisma';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    orders: 0,
    messages: 0,
    visits: 0,
    projects: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      
      setStats({
        orders: data.orders || 0,
        messages: data.messages || 0,
        visits: data.visits || 0,
        projects: data.projects || 0
      });
      
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statsData = [
    { title: 'Zamówienia', value: stats.orders.toString(), change: '+2', color: 'from-blue-500 to-cyan-500' },
    { title: 'Wiadomości', value: stats.messages.toString(), change: '0', color: 'from-purple-500 to-pink-500' },
    { title: 'Projekty', value: stats.projects.toString(), change: '+1', color: 'from-green-500 to-emerald-500' },
    { title: 'Odwiedziny', value: stats.visits.toString(), change: '+15%', color: 'from-orange-500 to-red-500' }
  ];

  const recentProjects = [
    { name: 'Sklep internetowy', status: 'W realizacji', progress: 75, deadline: '2024-01-15' },
    { name: 'Portfolio fotograficzne', status: 'Do akceptacji', progress: 95, deadline: '2024-01-10' },
    { name: 'Strona firmowa', status: 'Nowy', progress: 10, deadline: '2024-01-20' }
  ];

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500`}>
      <Head>
        <title>Panel - Designstron</title>
        <meta name="description" content="Twój panel zarządzania w Designstron" />
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

      <div className="relative pt-28 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className={`text-4xl font-black mb-2 ${textPrimary}`}>
              Witaj z powrotem, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{session.user.name}</span>!
            </h1>
            <p className={`${textSecondary} text-lg`}>Zarządzaj swoimi projektami i zamówieniami</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, i) => (
              <div 
                key={i}
                className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <span className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-gray-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold ${textPrimary} mb-1`}>{stat.value}</h3>
                <p className={`${textSecondary} text-sm`}>{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Ostatnie zamówienia</h2>
              <Link href="/panel/zamow" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Zobacz wszystkie
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div 
                    key={order.id}
                    className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'} rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`font-bold ${textPrimary}`}>Zamówienie #{order.id.slice(-8)}</h3>
                        <p className={`${textSecondary} text-sm`}>Data: {new Date(order.createdAt).toLocaleDateString('pl-PL')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'PAID' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'IN_PROGRESS' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status === 'PENDING' ? 'Oczekuje' :
                         order.status === 'PAID' ? 'Opłacone' :
                         order.status === 'IN_PROGRESS' ? 'W realizacji' :
                         order.status === 'COMPLETED' ? 'Ukończone' :
                         'Anulowane'}
                      </span>
                    </div>
                    <div className={`text-sm ${textSecondary}`}>
                      <p>Kwota: {order.totalAmount} zł</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${textSecondary}`}>
                <p>Brak zamówień</p>
                <Link href="/panel/zamow" className="text-blue-400 hover:text-blue-300 font-medium mt-2 inline-block">
                  Złóż pierwsze zamówienie
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link href="/panel/zamow" className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold ${textPrimary}`}>Nowe zamówienie</h3>
                  <p className={`${textSecondary} text-sm`}>Zamów nową stronę</p>
                </div>
              </div>
            </Link>

            <Link href="/panel/ustawienia" className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold ${textPrimary}`}>Ustawienia</h3>
                  <p className={`${textSecondary} text-sm`}>Zarządzaj kontem</p>
                </div>
              </div>
            </Link>

            {session.user.role === 'ADMIN' && (
              <Link href="/admin" className={`${cardBg} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-bold ${textPrimary}`}>Panel admina</h3>
                    <p className={`${textSecondary} text-sm`}>Zarządzaj systemem</p>
                  </div>
                </div>
              </Link>
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
