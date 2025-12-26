'use client';

import { useState } from 'react';

export default function SzkolaNaukiJazdy() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  const courses = [
    { 
      category: 'B', 
      name: 'Prawo jazdy kat. B', 
      price: '2400 zł', 
      duration: '30h jazd', 
      theory: '30h wykładów',
      popular: true 
    },
    { 
      category: 'A', 
      name: 'Prawo jazdy kat. A', 
      price: '1800 zł', 
      duration: '20h jazd', 
      theory: '30h wykładów',
      popular: false 
    },
    { 
      category: 'C', 
      name: 'Prawo jazdy kat. C', 
      price: '3200 zł', 
      duration: '30h jazd', 
      theory: '20h wykładów',
      popular: false 
    },
    { 
      category: 'B+E', 
      name: 'Prawo jazdy kat. B+E', 
      price: '1600 zł', 
      duration: '15h jazd', 
      theory: '10h wykładów',
      popular: false 
    },
  ];

  const schedule = [
    { date: '2025-01-03', time: '10:00', instructor: 'Jan Kowalski', type: 'Jazda', status: 'completed' },
    { date: '2025-01-05', time: '14:00', instructor: 'Jan Kowalski', type: 'Jazda', status: 'completed' },
    { date: '2025-01-08', time: '16:00', instructor: 'Jan Kowalski', type: 'Jazda', status: 'upcoming' },
    { date: '2025-01-10', time: '10:00', instructor: 'Anna Nowak', type: 'Wykład', status: 'upcoming' },
  ];

  const instructors = [
    { name: 'Jan Kowalski', experience: '15 lat', rating: 4.9, courses: 'B, B+E' },
    { name: 'Anna Nowak', experience: '10 lat', rating: 4.8, courses: 'B, A' },
    { name: 'Piotr Wiśniewski', experience: '8 lat', rating: 4.7, courses: 'B, C' },
  ];

  const handleAction = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-orange-900">🚗 DriveMaster</h1>
              <p className="text-sm text-gray-500">Profesjonalna szkoła jazdy</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-orange-600 hover:text-orange-800">
                📞 123 456 789
              </button>
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    handleAction();
                  }}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Panel Kursanta
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
                Zdobądź prawo jazdy z nami!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Doświadczeni instruktorzy • Nowoczesny park samochodowy • 95% zdawalność
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
                >
                  Zobacz kursy
                </button>
                <button className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg text-lg font-semibold hover:bg-orange-50 transition">
                  Darmowa konsultacja
                </button>
              </div>
            </section>

            {/* Stats */}
            <section className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl font-bold text-orange-600 mb-2">2500+</div>
                <p className="text-gray-600">Zadowolonych kursantów</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
                <p className="text-gray-600">Zdawalność za 1. razem</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl font-bold text-orange-600 mb-2">15 lat</div>
                <p className="text-gray-600">Doświadczenia</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-4xl font-bold text-orange-600 mb-2">12</div>
                <p className="text-gray-600">Instruktorów</p>
              </div>
            </section>

            {/* Courses */}
            <section id="courses" className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nasze kursy</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition relative ${
                      course.popular ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    {course.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Najpopularniejszy
                      </div>
                    )}
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-3xl font-bold text-orange-600">{course.category}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">{course.name}</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-orange-600 mb-2">{course.price}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>🚗 {course.duration}</p>
                        <p>📚 {course.theory}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleAction}
                      className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                    >
                      Zapisz się
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration Form */}
            <section className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Rejestracja online</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jan Kowalski"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data urodzenia *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jan@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="123 456 789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wybierz kurs *
                  </label>
                  <select
                    required
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Wybierz kategorię...</option>
                    {courses.map((course, idx) => (
                      <option key={idx} value={course.category}>
                        {course.name} - {course.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" required className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      Akceptuję regulamin i politykę prywatności *
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
                >
                  Zapisz się na kurs
                </button>
              </form>
            </section>

            {/* Instructors */}
            <section className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nasi instruktorzy</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {instructors.map((instructor, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md text-center">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👨‍🏫</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{instructor.name}</h4>
                    <p className="text-gray-600 mb-2">Doświadczenie: {instructor.experience}</p>
                    <p className="text-gray-600 mb-2">Kategorie: {instructor.courses}</p>
                    <div className="flex justify-center items-center gap-1 text-yellow-500 text-lg">
                      ⭐ <span className="text-gray-900 font-semibold">{instructor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Student Panel */
          <section>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Panel Kursanta</h3>
              <p className="text-gray-600 mb-8">Witaj! Śledź swoje postępy w nauce jazdy.</p>

              {/* Progress */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 rounded-xl p-6">
                  <p className="text-sm text-orange-600 font-semibold mb-1">Kurs</p>
                  <p className="text-2xl font-bold text-orange-900 mb-2">Kategoria B</p>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">12/30 godzin jazd</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Wykłady</p>
                  <p className="text-2xl font-bold text-blue-900 mb-2">18/30h</p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Pozostało 12h</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-sm text-green-600 font-semibold mb-1">Egzamin wewnętrzny</p>
                  <p className="text-2xl font-bold text-green-900 mb-2">25.01.2025</p>
                  <p className="text-xs text-gray-600 mt-1">Za 30 dni</p>
                </div>
              </div>

              {/* Schedule */}
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Harmonogram jazd</h4>
              <div className="space-y-4 mb-8">
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-6 transition ${
                      item.status === 'completed'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-orange-200 bg-orange-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{item.type}</h5>
                        <p className="text-gray-600">Instruktor: {item.instructor}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {item.status === 'completed' ? '✓ Ukończona' : '📅 Zaplanowana'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📅 {item.date}</span>
                      <span>🕐 {item.time}</span>
                    </div>
                    {item.status === 'upcoming' && (
                      <button
                        onClick={handleAction}
                        className="mt-4 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        Odwołaj jazdę
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">💳 Płatność za kurs</h4>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm opacity-90">Całkowity koszt kursu</p>
                    <p className="text-3xl font-bold">2400 zł</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Wpłacono</p>
                    <p className="text-3xl font-bold">1200 zł</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Pozostało</p>
                    <p className="text-3xl font-bold">1200 zł</p>
                  </div>
                </div>
                <button
                  onClick={handleAction}
                  className="w-full py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Opłać kolejną ratę
                </button>
              </div>

              <button
                onClick={handleAction}
                className="w-full mt-8 py-4 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
              >
                Umów kolejną jazdę
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}