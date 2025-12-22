import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';
import { signIn, getSession } from 'next-auth/react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

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

  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white/80 border-gray-200';

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Wprowadź email i hasło');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Nieprawidłowy email lub hasło');
      } else if (result?.ok) {
        // Sprawdź sesję i przekieruj
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('Wystąpił błąd podczas logowania');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500 relative`}>
      <Head>
        <title>Zaloguj się - Designstron</title>
        <meta name="description" content="Zaloguj się do swojego konta Designstron" />
      </Head>

      {/* Ultra Modern Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 100%)',
            left: `${mousePosition.x / 15}px`,
            top: `${mousePosition.y / 15}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 100%)',
            right: `${mousePosition.x / 20}px`,
            bottom: `${mousePosition.y / 20}px`,
            animation: 'float 8s ease-in-out infinite',
            transition: 'all 0.3s ease-out'
          }}
        />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(147, 51, 234, 0.15) 0px, transparent 50%),
              radial-gradient(at 40% 80%, rgba(168, 85, 247, 0.15) 0px, transparent 50%)
            `
          }} />
        </div>

        {/* Floating particles */}
        {mounted && [...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="auth" />

      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center z-10">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full" />
              <h1 className="relative text-6xl xl:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient pb-2">
                  Witamy z powrotem!
                </span>
              </h1>
            </div>
            
            <p className={`text-xl ${textSecondary} leading-relaxed max-w-lg`}>
              Zaloguj się i kontynuuj tworzenie niesamowitych stron internetowych, 
              które wyróżniają się na tle konkurencji.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 pt-8">
              {[
                { icon: '⚡', text: 'Szybka realizacja projektów', color: 'from-yellow-400 to-orange-400' },
                { icon: '🎨', text: 'Nowoczesny design', color: 'from-blue-400 to-cyan-400' },
                { icon: '🚀', text: 'Profesjonalne podejście', color: 'from-purple-400 to-pink-400' }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 group cursor-pointer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <span className={`${textPrimary} font-medium text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${item.color} group-hover:bg-clip-text transition-all`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className={`relative ${cardBg} backdrop-blur-2xl rounded-3xl border-2 shadow-2xl p-8 sm:p-12 transition-all duration-500 hover:shadow-blue-500/20 hover:-translate-y-1 group`}>
              {/* Decorative elements */}
              <div className="absolute -top-px left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <div className="absolute -bottom-px right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              
              <div className="text-center mb-8">
                <div className="inline-block mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${textPrimary}`}>
                  Zaloguj się
                </h2>
                <p className={`${textSecondary} text-base`}>
                  Wprowadź swoje dane logowania
                </p>
              </div>

              {error && (
                <div className="mb-6 relative overflow-hidden rounded-2xl animate-shake">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm" />
                  <div className="relative bg-red-500/10 border-2 border-red-500/30 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="group">
                    <label htmlFor="email" className={`block text-sm font-bold mb-2 ${textPrimary} group-focus-within:text-blue-400 transition-colors`}>
                      Adres email
                    </label>
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`relative w-full px-4 py-3.5 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-gray-500`}
                        placeholder="twoj@email.pl"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="password" className={`block text-sm font-bold mb-2 ${textPrimary} group-focus-within:text-blue-400 transition-colors`}>
                      Hasło
                    </label>
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`relative w-full px-4 py-3.5 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-gray-500 pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center cursor-pointer group/check">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                    />
                    <span className={`ml-3 text-sm font-medium ${textPrimary} group-hover/check:text-blue-400 transition-colors`}>
                      Zapamiętaj mnie
                    </span>
                  </label>

                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all"
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group/btn overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-70 group-hover/btn:opacity-100 transition duration-300 animate-gradient" />
                  <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-base text-white transform group-hover/btn:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logowanie...
                      </>
                    ) : (
                      <>
                        Zaloguj się
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-gray-300'}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${cardBg} ${textSecondary} font-medium`}>
                    lub kontynuuj z
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { 
                    name: 'Google', 
                    icon: <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />,
                    gradient: 'from-red-500 to-yellow-500'
                  },
                  { 
                    name: 'GitHub', 
                    icon: <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.205 20 14.437 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />,
                    gradient: 'from-gray-700 to-gray-900'
                  }
                ].map((provider, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`group/social relative py-3.5 px-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'} border-2 rounded-xl font-bold text-sm ${textPrimary} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2`}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover/social:opacity-100 blur transition duration-300 rounded-xl" style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}} />
                    <svg className="relative w-5 h-5 transition-transform group-hover/social:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      {provider.icon}
                    </svg>
                    <span className="relative">{provider.name}</span>
                  </button>
                ))}
              </div>

              <p className={`text-center mt-8 text-sm ${textSecondary}`}>
                Nie masz jeszcze konta?{' '}
                <Link href="/auth/signup" className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all">
                  Zarejestruj się teraz
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-gradient { 
          background-size: 200% 200%; 
          animation: gradient 3s ease infinite; 
        }
      `}</style>
    </div>
  );
}