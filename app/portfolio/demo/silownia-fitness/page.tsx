'use client';

import { useState } from 'react';

export default function SilowniaFitness() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      name: 'Basic',
      price: '99',
      period: '/miesiąc',
      features: ['Siłownia (6-22)', 'Szatnia i prysznice', 'Parking'],
      color: 'gray',
      popular: false,
    },
    {
      name: 'Premium',
      price: '149',
      period: '/miesiąc',
      features: ['Siłownia 24/7', 'Wszystkie zajęcia grupowe', 'Sauna i jacuzzi', 'Dietetyk online', 'Parking'],
      color: 'red',
      popular: true,
    },
    {
      name: 'VIP',
      price: '249',
      period: '/miesiąc',
      features: ['Wszystko z Premium', 'Trener personalny (4h/msc)', 'Masaże sportowe', 'Strefa relaksu', 'Ręczniki', 'Strefa VIP'],
      color: 'yellow',
      popular: false,
    },
  ];

  const classes = [
    { name: 'CrossFit', time: '06:00', instructor: 'Michał K.', spots: 12, max: 15, day: 'Poniedziałek', intensity: 'high' },
    { name: 'Yoga', time: '18:00', instructor: 'Anna W.', spots: 8, max: 20, day: 'Poniedziałek', intensity: 'low' },
    { name: 'Spinning', time: '07:00', instructor: 'Tomasz N.', spots: 3, max: 15, day: 'Wtorek', intensity: 'high' },
    { name: 'Zumba', time: '19:00', instructor: 'Kasia M.', spots: 15, max: 25, day: 'Wtorek', intensity: 'medium' },
    { name: 'TBC', time: '17:00', instructor: 'Monika P.', spots: 10, max: 20, day: 'Środa', intensity: 'medium' },
    { name: 'Pilates', time: '18:30', instructor: 'Anna W.', spots: 12, max: 15, day: 'Czwartek', intensity: 'low' },
  ];

  const visits = [
    { date: '2024-12-26', time: '07:30', duration: '90 min', type: 'Siłownia' },
    { date: '2024-12-24', time: '18:00', duration: '60 min', type: 'Yoga' },
    { date: '2024-12-22', time: '08:00', duration: '120 min', type: 'Siłownia' },
    { date: '2024-12-20', time: '19:00', duration: '45 min', type: 'Zumba' },
  ];

  const handleAction = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getIntensityColor = (intensity: string) => {
    if (intensity === 'high') return 'text-red-600 bg-red-100';
    if (intensity === 'medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Header - Dark with red accents */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-2xl font-bold">
                F
              </div>
              <div>
                <h1 className="text-2xl font-bold">FIT<span className="text-red-600">ZONE</span></h1>
                <p className="text-xs text-gray-400">Premium Fitness Club</p>
              </div>
            </div>
            <div className="flex gap-4">
              {!isLoggedIn ? (
                <>
                  <button className="px-4 py-2 text-gray-400 hover:text-white transition">
                    O nas
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(true);
                      handleAction();
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Zaloguj się
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                >
                  Wyloguj
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      <div className="bg-yellow-500 text-black py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold">
            🎨 PROJEKT KONCEPCYJNY – WERSJA DEMO | Portfolio designstron.pl
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <>
            {/* Hero - Full width image section */}
            <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-16 h-96 bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-6xl font-black mb-4 tracking-tight">
                  PRZEKROCZ SWOJE<br />GRANICE
                </h2>
                <p className="text-xl mb-8 text-gray-200">
                  Najlepiej wyposażona siłownia w mieście
                </p>
                <button
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-4 bg-red-600 text-white rounded-lg text-lg font-bold hover:bg-red-700 transition transform hover:scale-105"
                >
                  DOŁĄCZ TERAZ
                </button>
              </div>
            </section>

            {/* Stats - Horizontal layout */}
            <section className="mb-16 grid grid-cols-4 gap-4">
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <div className="text-5xl font-black text-red-600 mb-2">1200+</div>
                <p className="text-gray-400 uppercase text-sm tracking-wide">Członków</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <div className="text-5xl font-black text-red-600 mb-2">500m²</div>
                <p className="text-gray-400 uppercase text-sm tracking-wide">Powierzchni</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <div className="text-5xl font-black text-red-600 mb-2">50+</div>
                <p className="text-gray-400 uppercase text-sm tracking-wide">Zajęć/tydzień</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                <div className="text-5xl font-black text-red-600 mb-2">24/7</div>
                <p className="text-gray-400 uppercase text-sm tracking-wide">Dostępność</p>
              </div>
            </section>

            {/* Pricing Plans - Cards side by side */}
            <section id="plans" className="mb-16">
              <h3 className="text-4xl font-black mb-12 text-center">WYBIERZ SWÓJ <span className="text-red-600">KARNET</span></h3>
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`bg-zinc-900 rounded-2xl p-8 border-2 relative ${
                      plan.popular ? 'border-red-600 transform scale-105' : 'border-zinc-800'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-1 rounded-full text-sm font-bold">
                        NAJPOPULARNIEJSZY
                      </div>
                    )}
                    <h4 className="text-2xl font-black mb-4 uppercase">{plan.name}</h4>
                    <div className="mb-6">
                      <span className="text-5xl font-black">{plan.price}</span>
                      <span className="text-gray-400 text-lg"> zł{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleAction}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                        plan.popular
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      WYBIERZ
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Classes Schedule - Table layout */}
            <section className="mb-16">
              <h3 className="text-4xl font-black mb-12 text-center">GRAFIK <span className="text-red-600">ZAJĘĆ</span></h3>
              <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-zinc-800">
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Zajęcia</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Dzień</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Godzina</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Instruktor</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Intensywność</th>
                        <th className="px-6 py-4 text-left font-bold uppercase text-sm">Miejsca</th>
                        <th className="px-6 py-4 text-center font-bold uppercase text-sm">Akcja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((cls, idx) => (
                        <tr key={idx} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition">
                          <td className="px-6 py-4 font-bold">{cls.name}</td>
                          <td className="px-6 py-4 text-gray-400">{cls.day}</td>
                          <td className="px-6 py-4 text-gray-400">{cls.time}</td>
                          <td className="px-6 py-4 text-gray-400">{cls.instructor}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getIntensityColor(cls.intensity)}`}>
                              {cls.intensity === 'high' ? '🔥 Wysoka' : cls.intensity === 'medium' ? '⚡ Średnia' : '🌿 Niska'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cls.spots < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}>
                              {cls.spots}/{cls.max}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={handleAction}
                              disabled={cls.spots === 0}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                                cls.spots === 0
                                  ? 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              {cls.spots === 0 ? 'Pełne' : 'Zapisz się'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center">
              <h3 className="text-4xl font-black mb-4">GOTOWY NA ZMIANĘ?</h3>
              <p className="text-xl mb-8 text-gray-100">Pierwsze 7 dni za darmo dla nowych członków</p>
              <button
                onClick={handleAction}
                className="px-10 py-4 bg-black text-white rounded-lg text-lg font-bold hover:bg-zinc-900 transition"
              >
                ZAŁÓŻ KONTO
              </button>
            </section>
          </>
        ) : (
          /* Member Panel - Dashboard layout */
          <section>
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black mb-2">Witaj ponownie, <span className="text-black">Jan</span>!</h3>
                <p className="text-gray-100">Ostatnie wejście: Dzisiaj, 07:30</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-100 mb-1">Aktywny karnet</p>
                <p className="text-3xl font-black">PREMIUM</p>
                <p className="text-sm text-gray-100">Ważny do: 15.02.2025</p>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Wejścia w tym miesiącu</p>
                    <p className="text-4xl font-black text-red-600">18</p>
                  </div>
                  <span className="text-3xl">🏋️</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Cel: 25 wejść</p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Spalonych kalorii</p>
                    <p className="text-4xl font-black text-orange-600">8,420</p>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
                <p className="text-xs text-gray-500">+240 dzisiaj</p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Zajęcia grupowe</p>
                    <p className="text-4xl font-black text-yellow-600">12</p>
                  </div>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-xs text-gray-500">W tym miesiącu</p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Seria treningowa</p>
                    <p className="text-4xl font-black text-green-600">7</p>
                  </div>
                  <span className="text-3xl">⚡</span>
                </div>
                <p className="text-xs text-gray-500">Dni z rzędu</p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enrolled Classes */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h4 className="text-2xl font-black mb-6">ZAPISANE <span className="text-red-600">ZAJĘCIA</span></h4>
                <div className="space-y-4">
                  <div className="bg-zinc-800 rounded-xl p-4 border-l-4 border-red-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold text-lg">CrossFit</h5>
                        <p className="text-sm text-gray-400">Michał K.</p>
                      </div>
                      <span className="px-3 py-1 bg-red-600 rounded-full text-xs font-bold">DZISIAJ</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">🕐 18:00 - 19:00</p>
                    <button
                      onClick={handleAction}
                      className="text-red-500 hover:text-red-400 text-sm font-semibold"
                    >
                      Wypisz się
                    </button>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4 border-l-4 border-yellow-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold text-lg">Yoga</h5>
                        <p className="text-sm text-gray-400">Anna W.</p>
                      </div>
                      <span className="px-3 py-1 bg-zinc-700 rounded-full text-xs font-bold">JUTRO</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">🕐 18:00 - 19:00</p>
                    <button
                      onClick={handleAction}
                      className="text-red-500 hover:text-red-400 text-sm font-semibold"
                    >
                      Wypisz się
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAction}
                  className="w-full mt-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                >
                  ZAPISZ SIĘ NA ZAJĘCIA
                </button>
              </div>

              {/* Visit History */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h4 className="text-2xl font-black mb-6">HISTORIA <span className="text-red-600">WEJŚĆ</span></h4>
                <div className="space-y-3">
                  {visits.map((visit, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-zinc-800 rounded-lg p-4">
                      <div>
                        <p className="font-bold">{visit.type}</p>
                        <p className="text-sm text-gray-400">🕐 {visit.time} • ⏱️ {visit.duration}</p>
                      </div>
                      <p className="text-gray-400 text-sm">{visit.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Renew Membership */}
            <div className="mt-8 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 border border-zinc-700">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-2xl font-black mb-2">Przedłuż <span className="text-red-600">karnet</span></h4>
                  <p className="text-gray-400">Twój karnet wygasa za 50 dni</p>
                </div>
                <button
                  onClick={handleAction}
                  className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                >
                  PRZEDŁUŻ TERAZ
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}