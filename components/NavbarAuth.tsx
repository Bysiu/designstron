import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggleProps } from '@/types';

type NavbarProps = ThemeToggleProps & {
  currentPage?: string;
};

const NavbarAuth = memo(function NavbarAuth({ isDark, setIsDark, currentPage = 'home' }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass = isDark 
    ? 'bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-purple-500/10' 
    : 'bg-gray-900/95 backdrop-blur-2xl shadow-xl';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-slate-950 h-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="w-32 h-8 bg-slate-800 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-8">
              <div className="w-16 h-6 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-slate-800 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-slate-800 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-8 bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled || isMobileMenuOpen ? bgClass : 'bg-gray-900/50'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="relative group">
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DesignStron.pl
          </span>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {currentPage === 'home' ? (
              <>
                <a
                  href="#oferta"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Oferta
                </a>
                <Link
                  href="/portfolio"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Portfolio
                </Link>
                <Link
                  href="/kalkulator"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Kalkulator
                </Link>
                <a
                  href="#kontakt"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Kontakt
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Strona główna
                </Link>
                <Link
                  href="/#oferta"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Oferta
                </Link>
                <Link
                  href="/portfolio"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Portfolio
                </Link>
                <Link
                  href="/kalkulator"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Kalkulator
                </Link>
                <Link
                  href="/#kontakt"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Kontakt
                </Link>
              </>
            )}
            
            {/* Auth buttons */}
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <NotificationCenter />
                <Link
                  href="/panel"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Panel
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}
                >
                  Zaloguj
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Rejestracja
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden ${isDark ? 'text-gray-200' : 'text-gray-300'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-slate-900/95' : 'bg-gray-900/95'} backdrop-blur-2xl`}>
          <div className="px-6 py-4 space-y-2">
            {currentPage === 'home' ? (
              <>
                <a
                  href="#oferta"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Oferta
                  </div>
                </a>
                <Link
                  href="/portfolio"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Portfolio
                  </div>
                </Link>
                <Link
                  href="/kalkulator"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Kalkulator
                  </div>
                </Link>
                <a
                  href="#kontakt"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Kontakt
                  </div>
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Strona główna
                  </div>
                </Link>
                <Link
                  href="/#oferta"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Oferta
                  </div>
                </Link>
                <Link
                  href="/portfolio"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Portfolio
                  </div>
                </Link>
                <Link
                  href="/kalkulator"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Kalkulator
                  </div>
                </Link>
                <Link
                  href="/#kontakt"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium`}>
                    Kontakt
                  </div>
                </Link>
              </>
            )}
            
            {/* Mobile Auth buttons */}
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <>
                <Link
                  href="/panel"
                  className="block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                  onClick={closeMobileMenu}
                >
                  <div className="font-medium">Panel</div>
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all"
                    onClick={closeMobileMenu}
                  >
                    <div className="font-medium">Admin</div>
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}>
                    Wyloguj
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <div className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'} font-medium transition-colors`}>
                    Zaloguj
                  </div>
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                  onClick={closeMobileMenu}
                >
                  <div className="font-medium">Rejestracja</div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

export default NavbarAuth;
