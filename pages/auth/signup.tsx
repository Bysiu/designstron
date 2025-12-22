import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Musisz zaakceptować regulamin i politykę prywatności');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Wystąpił błąd podczas rejestracji');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      setError('Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500`}>
        <Head>
          <title>Rejestracja zakończona - Designstron</title>
        </Head>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className={`absolute w-96 h-96 ${isDark ? 'bg-green-500/20' : 'bg-green-400/30'} rounded-full blur-3xl animate-pulse`}
            style={{
              left: `${mousePosition.x / 20}px`,
              top: `${mousePosition.y / 20}px`,
            }}
          />
          <div 
            className={`absolute w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/30'} rounded-full blur-3xl animate-pulse`}
            style={{
              right: `${mousePosition.x / 30}px`,
              bottom: `${mousePosition.y / 30}px`,
            }}
          />
        </div>

        <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="auth" />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="max-w-md w-full animate-fade-in">
            <div className={`${cardBg} backdrop-blur-xl rounded-3xl border shadow-2xl p-12 text-center`}>
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Rejestracja zakończona!
              </h2>
              <p className={`${textSecondary} text-lg leading-relaxed mb-6`}>
                Twoje konto zostało pomyślnie utworzone. Za chwilę zostaniesz przekierowany do strony logowania.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Przekierowanie...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500`}>
      <Head>
        <title>Zarejestruj się - Designstron</title>
        <meta name="description" content="Stwórz konto w Designstron i zacznij zamawiać nowoczesne strony internetowe" />
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

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="auth" />

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="absolute inset-0">
          {mounted && [...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${isDark ? 'bg-purple-400/20' : 'bg-purple-500/30'} rounded-full animate-pulse`}
              style={{
                left: `${(i * 17 + 10) % 90}%`,
                top: `${(i * 23 + 15) % 80}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-md w-full space-y-8 z-10">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-black mb-4 leading-tight animate-fade-in-up">
              <span className={`block ${isDark ? 'bg-gradient-to-r from-white via-purple-100 to-pink-100' : 'bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900'} bg-clip-text text-transparent pb-2`}>
                Stwórz konto
              </span>
            </h2>
            <p className={`${textSecondary} text-lg leading-relaxed animate-fade-in-up mb-2`} style={{ animationDelay: '0.2s' }}>
              Rozpocznij swoją przygodę z nowoczesnymi stronami
            </p>
            <p className={`${textSecondary} animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
              Masz już konto?{' '}
              <Link href="/auth/signin" className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-all">
                Zaloguj się
              </Link>
            </p>
          </div>

          <div className={`relative p-8 sm:p-10 ${cardBg} backdrop-blur-xl rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up shadow-xl`} style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl" />
            
            {error && (
              <div className="mb-6 relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl" />
                <div className="relative bg-red-500/10 border border-red-500/30 p-4 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          
            <form className="relative space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className={`block text-sm font-bold mb-3 ${textPrimary}`}>
                  Imię i nazwisko
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`relative appearance-none block w-full px-4 py-4 ${isDark ? 'bg-slate-800/80 border-slate-700 focus:border-purple-500' : 'bg-gray-50/80 border-gray-300 focus:border-purple-500'} border-2 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-sm transition-all duration-200`}
                    placeholder="Jan Kowalski"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-bold mb-3 ${textPrimary}`}>
                  Adres email
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`relative appearance-none block w-full px-4 py-4 ${isDark ? 'bg-slate-800/80 border-slate-700 focus:border-purple-500' : 'bg-gray-50/80 border-gray-300 focus:border-purple-500'} border-2 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-sm transition-all duration-200`}
                    placeholder="twoj@email.pl"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-bold mb-3 ${textPrimary}`}>
                  Hasło
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`relative appearance-none block w-full px-4 py-4 ${isDark ? 'bg-slate-800/80 border-slate-700 focus:border-purple-500' : 'bg-gray-50/80 border-gray-300 focus:border-purple-500'} border-2 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-sm transition-all duration-200 pr-12`}
                    placeholder="Minimum 6 znaków"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-bold mb-3 ${textPrimary}`}>
                  Potwierdź hasło
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`relative appearance-none block w-full px-4 py-4 ${isDark ? 'bg-slate-800/80 border-slate-700 focus:border-purple-500' : 'bg-gray-50/80 border-gray-300 focus:border-purple-500'} border-2 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 sm:text-sm transition-all duration-200 pr-12`}
                    placeholder="Powtórz hasło"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer transition-transform hover:scale-110"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="acceptTerms" className={`text-sm ${textPrimary} cursor-pointer`}>
                    Akceptuję{' '}
                    <Link href="/regulamin" className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300">
                      regulamin
                    </Link>
                    {' '}i{' '}
                    <Link href="/polityka-prywatnosci" className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300">
                      politykę prywatności
                    </Link>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tworzenie konta...
                      </>
                    ) : (
                      <>
                        Utwórz konto
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t-2 ${isDark ? 'border-slate-700' : 'border-gray-300'}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${cardBg} ${textSecondary} font-medium backdrop-blur-sm`}>lub zarejestruj się przez</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`group relative py-3 px-4 ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600' : 'bg-gray-50/50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'} border-2 rounded-xl text-sm font-bold ${textPrimary} transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className={`group relative py-3 px-4 ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600' : 'bg-gray-50/50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'} border-2 rounded-xl text-sm font-bold ${textPrimary} transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.205 20 14.437 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}