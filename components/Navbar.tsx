import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggleProps } from '@/types';

type NavbarProps = ThemeToggleProps & {
  currentPage?: string;
};

export default function Navbar({ isDark, setIsDark, currentPage = 'home' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass = isDark 
    ? 'bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-purple-500/10' 
    : 'bg-white/95 backdrop-blur-2xl shadow-xl';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled || isMobileMenuOpen ? bgClass : 'bg-transparent'
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
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Oferta
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
                <Link
                  href="/portfolio"
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Portfolio
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <a
                  href="#kontakt"
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Kontakt
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Strona główna
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  href="/#oferta"
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Oferta
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  href="/#kontakt"
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors font-medium group`}
                >
                  Kontakt
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-100'} transition-all duration-300 shadow-lg`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ml-1"
            onClick={toggleMobileMenu}
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
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="px-6 py-4 space-y-4">
          {currentPage === 'home' ? (
            <>
              <a
                href="#oferta"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Oferta
                </div>
              </a>
              <Link
                href="/portfolio"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Portfolio
                </div>
              </Link>
              <a
                href="#kontakt"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
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
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Strona główna
                </div>
              </Link>
              <Link
                href="/#oferta"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Oferta
                </div>
              </Link>
              <Link
                href="/portfolio"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Portfolio
                </div>
              </Link>
              <Link
                href="/#kontakt"
                className="block py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <div className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium`}>
                  Kontakt
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}