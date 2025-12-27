'use client';

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from 'react';

export default function GabinetDentystyczny() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Usługi', href: '#services' },
    { label: 'Rezerwacja', href: '#booking' },
    { label: 'Kontakt', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !selectedDoctor) {
      alert('Proszę wypełnić wszystkie pola');
      return;
    }
    alert('Demo: rezerwacja zapisana (symulacja)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-3"
            onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              heroRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold flex items-center justify-center">DC</div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">DentalCare</p>
              <p className="text-xs text-gray-600 leading-tight">Gabinet stomatologiczny (DEMO)</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition">
                {item.label}
              </a>
            ))}
          </nav>

          <button className="md:hidden w-11 h-11 rounded-xl bg-white/80 border border-gray-100 shadow-sm" onClick={() => setMobileMenuOpen((v: boolean) => !v)}>
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="px-4 py-3 rounded-xl font-semibold text-gray-800 hover:bg-blue-50 transition" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        <section ref={heroRef} className="pt-16 md:pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-gray-100 shadow-sm">
              <span className="text-sm font-semibold text-blue-700">Nowoczesny gabinet</span>
              <span className="text-xs font-bold bg-yellow-300 text-black px-2 py-0.5 rounded-full">DEMO</span>
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Premium opieka.
              <span className="block bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Uśmiech bez stresu.</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-3xl">
              Minimalna wersja strony demo (naprawa builda). Po deployu przywrócimy pełny premium layout.
            </p>
          </div>
        </section>

        <section id="services" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Usługi</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Przegląd i konsultacja',
              'Wypełnienie zęba',
              'Scaling i piaskowanie',
              'Wybielanie zębów',
              'Leczenie kanałowe',
              'Implantologia',
            ].map((name) => (
              <button key={name} className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition" onClick={() => setSelectedService(name)}>
                <p className="font-bold text-gray-900">{name}</p>
                <p className="text-sm text-gray-600 mt-1">Kliknij aby wybrać usługę</p>
              </button>
            ))}
          </div>
        </section>

        <section id="booking" className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Rezerwacja wizyty (demo)</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <input type="date" value={selectedDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)} className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input type="time" value={selectedTime} onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedTime(e.target.value)} className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input type="text" placeholder="Wybrana usługa" value={selectedService} onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedService(e.target.value)} className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input type="text" placeholder="Lekarz" value={selectedDoctor} onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedDoctor(e.target.value)} className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200" />
              </div>
              <button onClick={handleBooking} className="mt-6 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black shadow-xl hover:shadow-2xl transition">
                Potwierdź rezerwację
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Kontakt</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900">Telefon</p>
              <a className="text-blue-700 font-semibold" href="tel:123456789">123 456 789</a>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900">Email</p>
              <p className="text-gray-700 font-semibold">kontakt@dentalcare.pl</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900">Adres</p>
              <p className="text-gray-700 font-semibold">ul. Zdrowia 15, Rzeszów</p>
            </div>
          </div>
        </section>

        <footer className="py-10 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-600"> &copy; {new Date().getFullYear()} designstron.pl • Strona demo</p>
            <button className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold" onClick={() => alert('Demo')}>Akcja demo</button>
          </div>
        </footer>
      </main>
    </div>
  );
}