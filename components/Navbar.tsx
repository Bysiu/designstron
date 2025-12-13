'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-bold text-xl text-blue-600">DesignStron.pl</span>
        <div className="space-x-6">
          <Link href="#oferta">Oferta</Link>
          <Link href="#portfolio">Portfolio</Link>
          <Link href="#kontakt">Kontakt</Link>
        </div>
      </div>
    </nav>
  );
}
