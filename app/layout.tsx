import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DesignStron.pl - Nowoczesne strony internetowe',
  description: 'Tworzymy strony dla małych firm',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}