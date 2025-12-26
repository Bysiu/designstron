'use client';

import { useState } from 'react';

export default function SalonFryzjerski() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showChat, setShowChat] = useState(false);

  const services = [
    { name: 'Strzyżenie damskie', price: '80-150 zł', duration: '45 min', icon: '✂️' },
    { name: 'Strzyżenie męskie', price: '50-80 zł', duration: '30 min', icon: '💇‍♂️' },
    { name: 'Koloryzacja', price: '200-400 zł', duration: '120 min', icon: '🎨' },
    { name: 'Pasemka', price: '250-500 zł', duration: '180 min', icon: '✨' },
    { name: 'Keratynowe prostowanie', price: '400 zł', duration: '150 min', icon: '💆‍♀️' },
    { name: 'Ombre/Balayage', price: '350-600 zł', duration: '180 min', icon: '🌈' },
    { name: 'Trwała ondulacja', price: '250 zł', duration: '120 min', icon: '〰️' },
    { name: 'Stylizacja na wesele', price: '200 zł', duration: '90 min', icon: '👰' },
  ];

  const stylists = [
    { name: 'Anna Kowalska', specialty: 'Koloryzacja', experience: '10 lat', rating: 4.9, image: '👩' },
    { name: 'Marta Nowak', specialty: 'Strzyżenie', experience: '8 lat', rating: 4.8, image: '👱‍♀️' },
    { name: 'Kasia Wiśniewska', specialty: 'Stylizacja ślubna', experience: '12 lat', rating: 5.0, image: '👩‍🦰' },
  ];

  const appointments = [
    { date: '2025-01-10', time: '14:00', service: 'Koloryzacja', stylist: 'Anna Kowalska', status: 'upcoming' },
    { date: '2024-12-15', time: '16:00', service: 'Strzyżenie', stylist: 'Marta Nowak', status: 'completed' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleAction = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h4 className="font-semibold">💬 Chat z salonem</h4>
            <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
              <p className="text-sm text-gray-800">Witaj! Jak możemy Ci pomóc?</p>
              <span className="text-xs text-gray-500">10:30</span>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Wpisz wiadomość..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition z-40 flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/48123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition z-40 flex items-center justify-center text-2xl"
      >
        📱
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Glamour Studio
              </h1>
              <p className="text-sm text-gray-500">Salon fryzjerski & beauty</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-pink-600 hover:text-pink-800">
                📍 ul. Piękna 12
              </button>
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    handleAction();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Moje wizyty
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
            {/* Hero */}
            <section className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Twoje piękno, nasza pasja
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Profesjonalne usługi fryzjerskie w wyjątkowej atmosferze
              </p>
              <button
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition"
              >
                Zarezerwuj wizytę
              </button>
            </section>

            {/* Services */}
            <section className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Cennik usług</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition">
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-2xl font-bold text-pink-600 mb-1">{service.price}</p>
                    <p className="text-sm text-gray-500 mb-4">⏱️ {service.duration}</p>
                    <button
                      onClick={handleAction}
                      className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                    >
                      Wybierz
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking */}
            <section id="booking" className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Rezerwacja online</h3>
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wybierz usługę
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Wybierz...</option>
                    {services.map((service, idx) => (
                      <option key={idx} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wybierz stylistę
                  </label>
                  <select
                    value={selectedStylist}
                    onChange={(e) => setSelectedStylist(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Dowolny...</option>
                    {stylists.map((stylist, idx) => (
                      <option key={idx} value={stylist.name}>{stylist.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wybierz datę
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dostępne godziny
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={handleAction}
                      className="py-2 border-2 border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAction}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition"
              >
                Zarezerwuj wizytę
              </button>
            </section>

            {/* Stylists */}
            <section className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nasz zespół</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {stylists.map((stylist, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-xl transition">
                    <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
                      {stylist.image}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{stylist.name}</h4>
                    <p className="text-pink-600 font-semibold mb-2">{stylist.specialty}</p>
                    <p className="text-sm text-gray-600 mb-3">Doświadczenie: {stylist.experience}</p>
                    <div className="flex justify-center items-center gap-1 text-yellow-500 mb-4">
                      ⭐ <span className="text-gray-900 font-semibold">{stylist.rating}</span>
                    </div>
                    <button
                      onClick={handleAction}
                      className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                      Umów wizytę
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nasze realizacje</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl hover:scale-105 transition"></div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Client Panel */
          <section>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Twój profil</h3>
              <p className="text-gray-600 mb-8">Zarządzaj swoimi wizytami i preferencjami</p>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                  <p className="text-sm text-pink-600 font-semibold mb-1">Nadchodząca wizyta</p>
                  <p className="text-2xl font-bold text-gray-900">10 STY, 14:00</p>
                  <p className="text-sm text-gray-600 mt-1">Koloryzacja</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-green-600 font-semibold mb-1">Ukończone wizyty</p>
                  <p className="text-3xl font-bold text-green-900">24</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-6">
                  <p className="text-sm text-yellow-600 font-semibold mb-1">Punkty lojalnościowe</p>
                  <p className="text-3xl font-bold text-yellow-900">480</p>
                </div>
              </div>

              {/* Favorite Stylist */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white mb-8">
                <h4 className="text-xl font-bold mb-3">⭐ Twój ulubiony stylista</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    👩
                  </div>
                  <div>
                    <p className="font-bold text-lg">Anna Kowalska</p>
                    <p className="text-sm opacity-90">Specjalizacja: Koloryzacja</p>
                  </div>
                </div>
                <button
                  onClick={handleAction}
                  className="mt-4 w-full py-2 bg-white text-pink-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Umów wizytę z Anną
                </button>
              </div>

              {/* Appointments History */}
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Historia wizyt</h4>
              <div className="space-y-4">
                {appointments.map((apt, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{apt.service}</h5>
                        <p className="text-gray-600">{apt.stylist}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          apt.status === 'upcoming'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {apt.status === 'upcoming' ? '📅 Zaplanowana' : '✓ Zakończona'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📅 {apt.date}</span>
                      <span>🕐 {apt.time}</span>
                    </div>
                    {apt.status === 'upcoming' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleAction}
                          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                        >
                          Zmień termin
                        </button>
                        <button
                          onClick={handleAction}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          Anuluj
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAction}
                className="w-full mt-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-lg transition"
              >
                Zarezerwuj nową wizytę
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}