import { useState } from 'react';
import Link from 'next/link';
import { ThemeProps } from '@/types';
import Image from 'next/image';

type FooterProps = ThemeProps & {
  currentPage?: string;
};

export default function Footer({ isDark, currentPage = 'home' }: FooterProps) {
  const [copiedText, setCopiedText] = useState<string>('');

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';
  const hoverText = isDark ? 'hover:text-white' : 'hover:text-gray-900';

  const copyToClipboard = async (text: string, type: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative py-16 px-4 sm:px-6 ${borderColor} border-t`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-4">
            <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DesignStron.pl
            </h3>
            <p className={`${textSecondary} leading-relaxed`}>
              Nowoczesne strony internetowe dla małych firm i lokalnych biznesów. 
              Pomagamy budować silną obecność w sieci.
            </p>
          </div>
          
          <div className="md:col-span-4">
            <h4 className={`font-bold text-lg mb-4 ${textPrimary}`}>Szybkie linki</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentPage === 'home' ? (
                <>
                  <a
                    href="#oferta"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Oferta
                  </a>
                  <Link
                    href="/portfolio"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Portfolio
                  </Link>
                  <a
                    href="#o-nas"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    O nas
                  </a>
                  <a
                    href="#kontakt"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Kontakt
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Strona główna
                  </Link>
                  <Link
                    href="/#oferta"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Oferta
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Portfolio
                  </Link>
                  <Link
                    href="/#kontakt"
                    className={`py-2 ${textSecondary} ${hoverText} transition-colors`}
                  >
                    Kontakt
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:col-span-4">
            <h4 className={`font-bold text-lg mb-4 ${textPrimary}`}>Kontakt</h4>
            <div className={`space-y-3 ${textSecondary}`}>
              <button
                onClick={() => copyToClipboard('kontakt@designstron.pl', 'email')}
                className="flex items-center gap-2 w-full text-left group"
              >
                <span className="flex-shrink-0">📧</span>
                <span className={`${hoverText} transition-colors`}>
                  kontakt@designstron.pl
                </span>
                {copiedText === 'email' && (
                  <span className="ml-2 text-xs text-green-400">Skopiowano!</span>
                )}
              </button>
              
              <button
                onClick={() => copyToClipboard('+48123456789', 'phone')}
                className="flex items-center gap-2 w-full text-left group"
              >
                <span className="flex-shrink-0">📱</span>
                <span className={`${hoverText} transition-colors`}>
                  +48 123 456 789
                </span>
                {copiedText === 'phone' && (
                  <span className="ml-2 text-xs text-green-400">Skopiowano!</span>
                )}
              </button>
              
              <div className="flex items-center gap-2 pt-1">
                <span>⏰</span>
                <span>Pn-Pt: 9:00-17:00</span>
              </div>
              
              <div className="flex gap-4 pt-2">
                <a href="#" className={`${textSecondary} ${hoverText} transition-colors`} aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className={`${textSecondary} ${hoverText} transition-colors`} aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`pt-8 ${borderColor} border-t text-center`}>
          <p className={textSecondary}>
            {currentYear} <span className={`font-bold ${textPrimary}`}>DesignStron.pl</span> - Wszystkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}