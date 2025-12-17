import { useState } from 'react';
import Link from 'next/link';
import { ThemeProps } from '@/types';

type FooterProps = ThemeProps & {
  currentPage?: string;
};

export default function Footer({ isDark, currentPage = 'home' }: FooterProps) {
  const [copiedText, setCopiedText] = useState<string>('');

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  const copyToClipboard = async (text: string, type: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string): void => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className={`relative py-16 px-6 ${isDark ? 'border-slate-800' : 'border-gray-200'} border-t`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DesignStron.pl
            </h3>
            <p className={`${textSecondary} leading-relaxed`}>
              Nowoczesne strony internetowe dla małych firm i lokalnych biznesów. 
              Pomagamy budować silną obecność w sieci.
            </p>
          </div>
          
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textPrimary}`}>Szybkie linki</h4>
            <div className="space-y-2">
              {currentPage === 'home' ? (
                <>
                  <a
                    href="#oferta"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Oferta
                  </a>
                  <Link
                    href="/portfolio"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Portfolio
                  </Link>
                  <a
                    href="#kontakt"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Kontakt
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Strona główna
                  </Link>
                  <Link
                    href="/#oferta"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Oferta
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Portfolio
                  </Link>
                  <Link
                    href="/#kontakt"
                    className={`block ${textSecondary} hover:text-blue-400 transition-colors`}
                  >
                    Kontakt
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h4 className={`font-bold text-lg mb-4 ${textPrimary}`}>Kontakt</h4>
            <div className={`space-y-2 ${textSecondary}`}>
              <button
                onClick={() => copyToClipboard('kontakt@designstron.pl', 'email')}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors group w-full text-left"
              >
                📧 kontakt@designstron.pl
                {copiedText === 'email' && (
                  <span className="text-xs text-green-400 ml-2">Skopiowano!</span>
                )}
              </button>
              <button
                onClick={() => copyToClipboard('+48123456789', 'phone')}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors group w-full text-left"
              >
                📱 +48 123 456 789
                {copiedText === 'phone' && (
                  <span className="text-xs text-green-400 ml-2">Skopiowano!</span>
                )}
              </button>
              <p>⏰ Pn-Pt: 9:00-17:00</p>
            </div>
          </div>
        </div>
        
        <div className={`pt-8 ${isDark ? 'border-slate-800' : 'border-gray-200'} border-t text-center`}>
          <p className={textSecondary}>
            © {new Date().getFullYear()} <span className={`font-bold ${textPrimary}`}>DesignStron.pl</span> - Wszystkie prawa zastrzeżone
          </p>
        </div>
      </div>
    </footer>
  );
}