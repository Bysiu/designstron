'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">DentalCare</h1>
              <p className="text-sm text-gray-500">Nowoczesny gabinet stomatologiczny</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800">Kontakt</button>
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Panel Pacjenta
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Wyloguj
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      <div className="bg-yellow-100 border-b border-yellow-200 py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-yellow-800">
            🎨 <strong>Projekt koncepcyjny – wersja demo</strong> | Portfolio designstron.pl
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Twój uśmiech w dobrych rękach
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Profesjonalna opieka stomatologiczna z wykorzystaniem najnowszych technologii
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Umów wizytę online
                </button>
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
                  Zadzwoń: 123 456 789
                </button>
              </div>
            </section>

            {/* Services */}
            <section className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nasze usługi</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl">🦷</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                      <span className="text-sm text-gray-500">{service.duration}</span>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Umów wizytę
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Calendar */}
            <section id="booking" className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Rezerwacja wizyty</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wybierz datę
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wybierz godzinę
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg border-2 transition ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:border-blue-400'
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    placeholder="Jan Kowalski"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    placeholder="123 456 789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wybierz usługę
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Wybierz...</option>
                  {services.map((service, idx) => (
                    <option key={idx}>{service.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBooking}
                className="w-full mt-6 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Potwierdź rezerwację
              </button>
            </section>

            {/* Map */}
            <section className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Nasza lokalizacja</h3>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
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
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <p className="font-semibold">Adres</p>
                    <p className="text-sm text-gray-600">ul. Zdrowia 15, Rzeszów</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p className="text-sm text-gray-600">123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <p className="font-semibold">Godziny</p>
                    <p className="text-sm text-gray-600">Pon-Pt: 8:00-18:00</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Patient Panel */
          <section>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Panel Pacjenta</h3>
              <p className="text-gray-600 mb-8">Witaj ponownie! Zarządzaj swoimi wizytami.</p>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Nadchodząca wizyta</p>
                  <p className="text-3xl font-bold text-blue-900">15 STY</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-green-600 font-semibold mb-1">Ukończone wizyty</p>
                  <p className="text-3xl font-bold text-green-900">8</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Punkty lojalnościowe</p>
                  <p className="text-3xl font-bold text-purple-900">240</p>
                </div>
              </div>

              {/* Appointments List */}
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Twoje wizyty</h4>
              <div className="space-y-4 mb-8">
                {appointments.map((apt, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{apt.service}</h5>
                        <p className="text-gray-600">{apt.doctor}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          apt.status === 'Potwierdzona'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>📅 {apt.date}</span>
                      <span>🕐 {apt.time}</span>
                    </div>
                    {apt.status === 'Potwierdzona' && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleBooking}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Zapłać za wizytę (150 zł)
                        </button>
                        <button
                          onClick={handleBooking}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          Anuluj
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Medical History */}
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Historia leczenia</h4>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">10.12.2024 - Wypełnienie zęba 36</span>
                    <button className="text-blue-600 hover:text-blue-800">Pobierz PDF</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">05.09.2024 - Scaling i piaskowanie</span>
                    <button className="text-blue-600 hover:text-blue-800">Pobierz PDF</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">12.06.2024 - Przegląd periodontologiczny</span>
                    <button className="text-blue-600 hover:text-blue-800">Pobierz PDF</button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Umów kolejną wizytę
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}