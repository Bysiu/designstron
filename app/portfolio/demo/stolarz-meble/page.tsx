'use client';

import { useState, type ChangeEvent } from 'react';

export default function StolarzMeble() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const portfolio = [
    { title: 'Szafa wnękowa', category: 'Szafy', wood: 'Dąb', year: '2024' },
    { title: 'Stół z litego drewna', category: 'Stoły', wood: 'Orzech', year: '2024' },
    { title: 'Komoda loft', category: 'Komody', wood: 'Metal + Sosna', year: '2024' },
    { title: 'Regał do biura', category: 'Regały', wood: 'Jesion', year: '2023' },
    { title: 'Kuchnia na wymiar', category: 'Kuchnie', wood: 'MDF lakier', year: '2024' },
    { title: 'Biblioteczka', category: 'Regały', wood: 'Buk', year: '2023' },
  ];

  const orders = [
    { 
      id: 'ZAM-2024-12', 
      project: 'Szafa wnękowa 2.5m', 
      status: 'W realizacji', 
      progress: 65, 
      estimatedCost: '4,500 zł',
      deadline: '15.01.2025'
    },
    { 
      id: 'ZAM-2024-08', 
      project: 'Stół rozkładany', 
      status: 'Zakończone', 
      progress: 100, 
      estimatedCost: '2,800 zł',
      deadline: '20.08.2024'
    },
  ];

  const handleAction = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      handleAction();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-amber-800 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ To jest wersja demo – funkcja pokazowa
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-24 right-4 w-96 bg-white rounded-2xl shadow-2xl z-50 border-2 border-amber-200">
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h4 className="font-bold">💬 Chat z wykonawcą</h4>
              <p className="text-xs opacity-90">Marek Nowak - Stolarz</p>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200 text-xl">✕</button>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-amber-50">
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm font-semibold text-amber-900 mb-1">Marek Nowak</p>
                <p className="text-sm text-gray-800">Dzień dobry! Otrzymałem Pana wycenę. Mam kilka pytań technicznych.</p>
                <span className="text-xs text-gray-500">14:30</span>
              </div>
              <div className="bg-amber-600 text-white rounded-lg p-3 shadow-sm ml-8">
                <p className="text-sm">Dzień dobry! Proszę pytać, chętnie odpowiem.</p>
                <span className="text-xs opacity-80">14:32</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-amber-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Napisz wiadomość..."
                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Wyślij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 w-16 h-16 bg-amber-700 text-white rounded-full shadow-xl hover:shadow-2xl transition z-40 flex items-center justify-center text-2xl font-bold"
      >
        💬
      </button>

      {/* Rustic Header with wood texture feel */}
      <header className="bg-gradient-to-b from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-700 rounded-lg flex items-center justify-center text-3xl border-2 border-amber-600">
                🪚
              </div>
              <div>
                <h1 className="text-3xl font-bold">WoodCraft Studio</h1>
                <p className="text-amber-200 text-sm">Meble z drewna na wymiar • Rzemiosło od 1995</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-amber-200 hover:text-white transition">
                📞 +48 123 456 789
              </button>
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    handleAction();
                  }}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-semibold border-2 border-amber-500"
                >
                  Panel Klienta
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition"
                >
                  Wyloguj
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      <div className="bg-yellow-100 border-b-2 border-yellow-300 py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-yellow-900 font-semibold">
            🎨 PROJEKT KONCEPCYJNY – WERSJA DEMO | Portfolio designstron.pl
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <>
            {/* Hero with side-by-side layout */}
            <section className="mb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-5xl font-bold text-amber-900 mb-6 leading-tight">
                    Twoje marzenia,<br />
                    nasze <span className="text-amber-700">rzemiosło</span>
                  </h2>
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    Tworzymy unikalne meble z litego drewna, dopasowane do Twoich potrzeb i przestrzeni. 
                    Każdy projekt to połączenie tradycji stolarskiej z nowoczesnym designem.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 bg-amber-700 text-white rounded-lg text-lg font-bold hover:bg-amber-800 transition shadow-lg"
                    >
                      Zamów wycenę
                    </button>
                    <button
                      onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 border-2 border-amber-700 text-amber-900 rounded-lg text-lg font-bold hover:bg-amber-100 transition"
                    >
                      Zobacz realizacje
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-200 to-amber-300 rounded-3xl h-96 flex items-center justify-center shadow-xl">
                  <span className="text-8xl">🪑</span>
                </div>
              </div>
            </section>

            {/* Features - Icon grid */}
            <section className="mb-20">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600">
                  <div className="text-4xl mb-3">🌳</div>
                  <h4 className="font-bold text-lg text-amber-900 mb-2">Naturalne drewno</h4>
                  <p className="text-sm text-gray-600">Tylko najwyższej jakości materiały</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600">
                  <div className="text-4xl mb-3">📐</div>
                  <h4 className="font-bold text-lg text-amber-900 mb-2">Projekt 3D</h4>
                  <p className="text-sm text-gray-600">Wizualizacja przed realizacją</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600">
                  <div className="text-4xl mb-3">🔧</div>
                  <h4 className="font-bold text-lg text-amber-900 mb-2">Montaż gratis</h4>
                  <p className="text-sm text-gray-600">Transport i montaż w cenie</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-600">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="font-bold text-lg text-amber-900 mb-2">Gwarancja 5 lat</h4>
                  <p className="text-sm text-gray-600">Pewność najwyższej jakości</p>
                </div>
              </div>
            </section>

            {/* Portfolio - Masonry-like grid */}
            <section id="portfolio" className="mb-20">
              <h3 className="text-4xl font-bold text-amber-900 mb-12 text-center">Nasze realizacje</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {portfolio.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group">
                    <div className="h-64 bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-6xl group-hover:scale-105 transition">
                      {item.category === 'Szafy' ? '🚪' : item.category === 'Stoły' ? '🪑' : item.category === 'Kuchnie' ? '🍳' : '📚'}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{item.category}</span>
                      <h4 className="text-xl font-bold text-amber-900 mb-2">{item.title}</h4>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>🌳 {item.wood}</span>
                        <span>📅 {item.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quote Form - Two column layout */}
            <section id="quote" className="bg-white rounded-3xl shadow-2xl p-12 mb-20 border-t-4 border-amber-600">
              <h3 className="text-4xl font-bold text-amber-900 mb-3">Zamów bezpłatną wycenę</h3>
              <p className="text-gray-600 mb-10">Wypełnij formularz, a skontaktujemy się w ciągu 24h</p>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Typ mebla *
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                      <option>Wybierz...</option>
                      <option>Szafa / Garderoba</option>
                      <option>Stół / Biurko</option>
                      <option>Komoda / Regał</option>
                      <option>Kuchnia na wymiar</option>
                      <option>Inne</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Wymiary (przybliżone)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Szerokość (cm)"
                        className="px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                      />
                      <input
                        type="text"
                        placeholder="Wysokość (cm)"
                        className="px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                      />
                      <input
                        type="text"
                        placeholder="Głębokość (cm)"
                        className="px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Preferowane drewno
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600">
                      <option>Nie mam preferencji</option>
                      <option>Dąb</option>
                      <option>Orzech</option>
                      <option>Jesion</option>
                      <option>Sosna</option>
                      <option>Buk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      placeholder="Jan Kowalski"
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="+48 123 456 789"
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="jan@example.com"
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-amber-900 mb-2">
                  Opis projektu
                </label>
                <textarea
                  rows={4}
                  placeholder="Opisz swoje wymagania, preferencje stylistyczne..."
                  className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-amber-900 mb-2">
                  Załącz inspiracje (zdjęcia, szkice)
                </label>
                <div className="border-2 border-dashed border-amber-400 rounded-lg p-8 text-center bg-amber-50 hover:bg-amber-100 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-5xl mb-3">📎</div>
                    <p className="text-amber-900 font-semibold mb-1">Kliknij aby dodać pliki</p>
                    <p className="text-sm text-gray-600">lub przeciągnij i upuść (JPG, PNG, PDF)</p>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="bg-white px-4 py-2 rounded-lg text-sm text-gray-700 flex items-center justify-between">
                          <span>📄 {file}</span>
                          <button onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))} className="text-red-600 hover:text-red-800">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleAction}
                className="w-full mt-8 py-4 bg-amber-700 text-white rounded-lg text-xl font-bold hover:bg-amber-800 transition shadow-lg"
              >
                Wyślij zapytanie o wycenę
              </button>
            </section>
          </>
        ) : (
          /* Client Panel - Status tracking */
          <section>
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-t-4 border-amber-600">
              <h3 className="text-3xl font-bold text-amber-900 mb-2">Panel Klienta</h3>
              <p className="text-gray-600 mb-8">Śledź postęp swoich zamówień</p>

              {/* Orders List */}
              <div className="space-y-6">
                {orders.map((order, idx) => (
                  <div key={idx} className="border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-2xl font-bold text-amber-900">{order.project}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'W realizacji' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Numer zamówienia: {order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Termin realizacji</p>
                        <p className="text-xl font-bold text-amber-900">{order.deadline}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-amber-900">Postęp realizacji</span>
                        <span className="font-bold text-amber-700">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-amber-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-amber-500 h-3 rounded-full transition-all"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="bg-amber-50 rounded-xl p-4 mb-4">
                      <h5 className="font-bold text-amber-900 mb-3">Kosztorys</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Materiały</span>
                          <span className="font-semibold">2,800 zł</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Robocizna</span>
                          <span className="font-semibold">1,200 zł</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Transport i montaż</span>
                          <span className="font-semibold">500 zł</span>
                        </div>
                        <div className="border-t-2 border-amber-200 pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-amber-900">RAZEM</span>
                          <span className="font-bold text-xl text-amber-700">{order.estimatedCost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === 'W realizacji' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowChat(true)}
                          className="flex-1 py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition"
                        >
                          💬 Napisz do wykonawcy
                        </button>
                        <button
                          onClick={handleAction}
                          className="px-6 py-3 border-2 border-amber-700 text-amber-900 rounded-lg font-bold hover:bg-amber-100 transition"
                        >
                          📄 Pobierz dokumenty
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleAction}
                className="w-full mt-8 py-4 bg-amber-700 text-white rounded-lg text-xl font-bold hover:bg-amber-800 transition"
              >
                Złóż nowe zamówienie
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}