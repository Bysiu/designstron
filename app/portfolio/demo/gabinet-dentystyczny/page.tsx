'use client';

import { useState, type ChangeEvent } from 'react';

export default function GabinetDentystyczny() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const services = [
    { name: 'Przegląd i konsultacja', price: '150 zł', duration: '30 min' },
    { name: 'Wypełnienie zęba', price: '200-400 zł', duration: '45 min' },
    { name: 'Scaling i piaskowanie', price: '250 zł', duration: '60 min' },
    { name: 'Wybielanie zębów', price: '800 zł', duration: '90 min' },
    { name: 'Leczenie kanałowe', price: '600-1200 zł', duration: '120 min' },
    { name: 'Ekstrakcja zęba', price: '300 zł', duration: '30 min' },
  ];

  const appointments = [
    { date: '2025-01-15', time: '10:00', service: 'Przegląd', doctor: 'Dr Anna Kowalska', status: 'Potwierdzona' },
    { date: '2024-12-10', time: '14:30', service: 'Wypełnienie', doctor: 'Dr Jan Nowak', status: 'Zakończona' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBooking = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-3xl animate-blob" />
        <div className="absolute top-24 -right-28 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-3xl animate-blob animation-delay-200" />
        <div className="absolute -bottom-36 left-1/3 h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-3xl animate-blob animation-delay-400" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-xl border border-white/15 shadow-2xl animate-fade-in">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-xl">🦷</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">DentalCare</h1>
                <p className="text-sm text-slate-300">Nowoczesny gabinet stomatologiczny</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-slate-200 hover:text-white transition">Kontakt</button>
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110 transition"
                >
                  Panel Pacjenta
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-6 py-2 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                >
                  Wyloguj
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      <div className="relative z-10 border-b border-white/10 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center">
          <p className="text-sm text-amber-200">
            🎨 <strong>Projekt koncepcyjny – wersja demo</strong> | Portfolio designstron.pl
          </p>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <>
            {/* Hero Section */}
            <section className="mb-16">
              <div className="grid lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-4 py-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm text-slate-200">Nowoczesna stomatologia • Rezerwacje online</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-5 animate-fade-in-up">
                    Twój uśmiech
                    <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
                      w dobrych rękach
                    </span>
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl animate-fade-in-up animation-delay-200">
                    Profesjonalna opieka stomatologiczna z wykorzystaniem najnowszych technologii — szybkie terminy, przejrzyste ceny, komfort pacjenta.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                    <button
                      onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:brightness-110 transition"
                    >
                      Umów wizytę online
                    </button>
                    <button className="px-8 py-4 rounded-2xl border border-white/15 bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition">
                      Zadzwoń: 123 456 789
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 lg:pl-12">
                  <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 shadow-2xl">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent" />
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                          <p className="text-slate-300 text-sm">Ocena pacjentów</p>
                          <p className="text-3xl font-black mt-1">4.9/5</p>
                          <p className="text-slate-400 text-sm">(1 240 opinii)</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                          <p className="text-slate-300 text-sm">Wolne terminy</p>
                          <p className="text-3xl font-black mt-1">Dziś</p>
                          <p className="text-slate-400 text-sm">szybka rezerwacja</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-5">
                        <p className="text-sm text-slate-300 mb-3">Najczęściej wybierane</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/20 text-cyan-100 text-sm">Przegląd</span>
                          <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-100 text-sm">Wybielanie</span>
                          <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-100 text-sm">Scaling</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="mb-16">
              <div className="flex items-end justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black">Nasze usługi</h3>
                  <p className="text-slate-300 mt-2">Transparentne ceny, sprawdzone procedury, komfort pacjenta.</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-slate-300">Średni czas wizyty</p>
                  <p className="text-2xl font-black">30–90 min</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-blue-500/25 border border-white/10 flex items-center justify-center">
                        <span className="text-xl">🦷</span>
                      </div>
                      <span className="text-xs font-bold tracking-widest text-slate-200/80">USŁUGA</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                        {service.price}
                      </span>
                      <span className="text-sm text-slate-300">{service.duration}</span>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="w-full py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition"
                    >
                      Umów wizytę
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Calendar */}
            <section id="booking" className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 mb-16">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black">Rezerwacja wizyty</h3>
                  <p className="text-slate-300 mt-2">Wybierz termin, godzinę i usługę — resztę potwierdzimy SMS-em.</p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-slate-300">Czas odpowiedzi</p>
                    <p className="font-black">~5 min</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-slate-300">Płatność</p>
                    <p className="font-black">online / na miejscu</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Wybierz datę
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Wybierz godzinę
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-2xl border transition ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    placeholder="Jan Kowalski"
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    placeholder="123 456 789"
                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Wybierz usługę
                </label>
                <select className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-cyan-400/40">
                  <option>Wybierz...</option>
                  {services.map((service, idx) => (
                    <option key={idx}>{service.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBooking}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:brightness-110 transition"
              >
                Potwierdź rezerwację
              </button>
            </section>

            {/* Map */}
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
              <h3 className="text-3xl sm:text-4xl font-black mb-6">Nasza lokalizacja</h3>
              <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.5!2d21.9992!3d50.0412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDAyJzI4LjMiTiAyMcKwNTknNTcuMSJF!5e0!3m2!1spl!2spl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <p className="font-semibold">Adres</p>
                    <p className="text-sm text-slate-300">ul. Zdrowia 15, Rzeszów</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-sm text-slate-300">123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <p className="font-semibold">Godziny</p>
                    <p className="text-sm text-slate-300">Pon-Pt: 8:00-18:00</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Patient Panel */
          <section>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black mb-2">Panel Pacjenta</h3>
                  <p className="text-slate-300">Witaj ponownie! Zarządzaj swoimi wizytami.</p>
                </div>
                <button
                  onClick={handleBooking}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:brightness-110 transition"
                >
                  Umów kolejną wizytę
                </button>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 p-6">
                  <p className="text-sm text-cyan-200 font-semibold mb-1">Nadchodząca wizyta</p>
                  <p className="text-3xl font-black">15 STY</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-emerald-500/10 p-6">
                  <p className="text-sm text-emerald-200 font-semibold mb-1">Ukończone wizyty</p>
                  <p className="text-3xl font-black">8</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-6">
                  <p className="text-sm text-indigo-200 font-semibold mb-1">Punkty lojalnościowe</p>
                  <p className="text-3xl font-black">240</p>
                </div>
              </div>

              {/* Appointments List */}
              <h4 className="text-2xl sm:text-3xl font-black mb-4">Twoje wizyty</h4>
              <div className="space-y-4 mb-8">
                {appointments.map((apt, idx) => (
                  <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-xl font-black">{apt.service}</h5>
                        <p className="text-slate-300">{apt.doctor}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          apt.status === 'Potwierdzona'
                            ? 'bg-emerald-500/15 text-emerald-100 border-emerald-400/20'
                            : 'bg-white/10 text-slate-100 border-white/15'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-300 mb-4">
                      <span>📅 {apt.date}</span>
                      <span>🕐 {apt.time}</span>
                    </div>
                    {apt.status === 'Potwierdzona' && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleBooking}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:brightness-110 transition"
                        >
                          Zapłać za wizytę (150 zł)
                        </button>
                        <button
                          onClick={handleBooking}
                          className="px-4 py-2 rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/15 transition"
                        >
                          Anuluj
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Medical History */}
              <h4 className="text-2xl sm:text-3xl font-black mb-4">Historia leczenia</h4>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200">10.12.2024 - Wypełnienie zęba 36</span>
                    <button className="text-cyan-200 hover:text-cyan-100 transition">Pobierz PDF</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200">05.09.2024 - Scaling i piaskowanie</span>
                    <button className="text-cyan-200 hover:text-cyan-100 transition">Pobierz PDF</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200">12.06.2024 - Przegląd periodontologiczny</span>
                    <button className="text-cyan-200 hover:text-cyan-100 transition">Pobierz PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}