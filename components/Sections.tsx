'use client';

import { useState, useEffect } from 'react';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import NavbarAuth from '@/components/NavbarAuth';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DesignStronLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    socials: '',
    message: ''
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą w ciągu 24 godzin.');
    setForm({
      name: '',
      email: '',
      phone: '',
      socials: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: '✨',
      title: 'Nowoczesny design',
      description: 'Projektujemy estetyczne i czytelne strony dopasowane do Twojej branży. Każdy projekt to unikalne połączenie funkcjonalności z pięknem wizualnym.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '⚡',
      title: 'Szybka realizacja',
      description: 'Większość projektów realizujemy w 7–14 dni. Działamy sprawnie, bez zbędnych opóźnień, dzięki sprawdzonemu procesowi i doświadczonemu zespołowi.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📱',
      title: 'Pełna responsywność',
      description: 'Twoja strona będzie perfekcyjnie działać na wszystkich urządzeniach – od smartfonów, przez tablety, aż po duże monitory. Testujemy każdy widok.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '🎯',
      title: 'Prosta obsługa',
      description: 'Tworzymy strony łatwe w użytkowaniu i rozbudowie. Otrzymujesz pełną dokumentację i wsparcie techniczne przez 30 dni po wdrożeniu.',
      gradient: 'from-green-500 to-emerald-500'
    },
  ];

  const offers = [
    {
      title: 'Strona wizytówka',
      price: '800',
      description: 'Idealne rozwiązanie dla małych firm i osób rozpoczynających działalność. Wszystko czego potrzebujesz do prezentacji w sieci.',
      features: [
        'Responsywny design dostosowany do marki',
        'Formularz kontaktowy z powiadomieniami',
        'Integracja z Google Maps',
        'Podstawowe SEO i optymalizacja',
        'Panel administracyjny',
        '30 dni wsparcia technicznego'
      ],
      icon: '🎨',
      color: 'blue'
    },
    {
      title: 'Strona firmowa',
      price: '1500',
      description: 'Rozbudowana strona z podstronami, prezentacją usług i realizacji. Kompleksowe rozwiązanie dla rozwijających się firm.',
      features: [
        'Wielostronicowa struktura (do 10 podstron)',
        'Sekcja portfolio z galerią',
        'Blog/Aktualności z systemem CMS',
        'Zaawansowane SEO i analytics',
        'Integracje z mediami społecznościowymi',
        'Panel zarządzania treścią',
        '60 dni wsparcia + szkolenie'
      ],
      featured: true,
      icon: '🚀',
      color: 'purple'
    },
    {
      title: 'Landing page',
      price: '1000',
      description: 'Strona nastawiona na sprzedaż lub pozyskiwanie zapytań. Maksymalna konwersja to nasz priorytet.',
      features: [
        'Optymalizacja konwersji (CRO)',
        'A/B testing ready',
        'Integracja z Google Ads i Facebook',
        'Google Analytics 4',
        'Przyciski CTA i formularze leadowe',
        '45 dni wsparcia'
      ],
      icon: '💎',
      color: 'pink'
    },
  ];

  const steps = [
    { 
      title: 'Kontakt', 
      desc: 'Rozmawiamy o Twoich potrzebach, celach biznesowych i grupie docelowej. Poznajemy Twoją wizję i oczekiwania.',
      icon: '💬', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      title: 'Projekt', 
      desc: 'Przygotowujemy koncepcję wizualną dopasowaną do branży. Prezentujemy makiety i zbieramy feedback.',
      icon: '🎨', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      title: 'Wdrożenie', 
      desc: 'Kodujemy, testujemy i optymalizujemy stronę. Dbamy o każdy szczegół techniczny i wizualny.',
      icon: '⚙️', 
      color: 'from-orange-500 to-red-500' 
    },
    { 
      title: 'Publikacja', 
      desc: 'Uruchamiamy stronę, przeprowadzamy szkolenie i przekazujemy kompletną dokumentację. Jesteśmy dostępni przez cały okres wsparcia.',
      icon: '🚀', 
      color: 'from-green-500 to-emerald-500' 
    },
  ];

  const faqs = [
    { 
      q: 'Ile dokładnie kosztuje strona internetowa?', 
      a: 'Cena zależy od rodzaju i zakresu projektu. Prosta strona wizytówka to koszt od 800 zł, strony firmowe zaczynają się od 1500 zł, a landing page od 1000 zł. Każdy projekt wyceniamy indywidualnie po dokładnym poznaniu wymagań. Podane ceny to orientacyjne punkty startowe – ostateczna kwota zależy od dodatkowych funkcjonalności, integracji czy liczby podstron.' 
    },
    { 
      q: 'Ile czasu trwa wykonanie strony internetowej?', 
      a: 'Standardowo realizacja trwa 7-14 dni roboczych od momentu zatwierdzenia projektu graficznego i otrzymania wszystkich materiałów (teksty, zdjęcia, logo). Dla bardziej złożonych projektów czas może się wydłużyć do 3-4 tygodni. Zawsze ustalamy realny harmonogram na początku współpracy i informujemy o postępach.' 
    },
    { 
      q: 'Czy strona będzie działać poprawnie na telefonach i tabletach?', 
      a: 'Tak, absolutnie! Wszystkie nasze strony są w pełni responsywne, co oznacza że automatycznie dostosowują się do rozmiaru ekranu. Testujemy każdy projekt na różnych urządzeniach (smartfony, tablety, laptopy, monitory) i przeglądarkach (Chrome, Safari, Firefox, Edge), aby zapewnić idealne działanie wszędzie.' 
    },
    { 
      q: 'Czy będę mógł samodzielnie edytować treści na stronie?', 
      a: 'Tak! Tworzymy strony z prostym panelem administracyjnym, który pozwala na samodzielną edycję tekstów, dodawanie zdjęć czy publikowanie aktualności. Nie musisz znać się na programowaniu – interfejs jest intuicyjny. Dodatkowo przeprowadzamy szkolenie pokazujące jak zarządzać stroną oraz dostarczamy video-instrukcje.' 
    },
    { 
      q: 'Czy pomagacie z domeną i hostingiem?', 
      a: 'Tak, kompleksowo zajmujemy się całym procesem. Pomożemy wybrać i zarejestrować odpowiednią domenę, dobierzemy hosting o odpowiedniej wydajności i przeprowadzimy pełną konfigurację techniczną. Możemy również zarządzać hostingiem w Twoim imieniu lub nauczyć Cię jak to robić samodzielnie.' 
    },
    { 
      q: 'Co się stanie jeśli będę potrzebował zmian po publikacji?', 
      a: 'Każdy pakiet zawiera okres wsparcia technicznego (30-60 dni w zależności od pakietu), podczas którego wprowadzamy drobne poprawki i pomagamy z obsługą strony. Po tym okresie oferujemy elastyczne umowy serwisowe lub rozliczamy zmiany godzinowo. Zawsze jesteśmy dostępni dla naszych klientów.' 
    },
    { 
      q: 'Czy strona będzie zoptymalizowana pod SEO?', 
      a: 'Każda nasza strona zawiera podstawową optymalizację SEO – poprawną strukturę nagłówków, meta tagi, responsywność, szybkość ładowania i przyjazne URL. Dla pakietów firmowych wykonujemy także badanie słów kluczowych i zaawansowaną optymalizację. Możemy również zaproponować stałą współpracę w zakresie pozycjonowania.' 
    },
  ];

  const bgClass = isDark 
    ? 'bg-slate-950 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900';
  
  const cardBg = isDark 
    ? 'bg-slate-900/50 border-slate-800' 
    : 'bg-white/80 border-gray-200';

  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/30'} rounded-full blur-3xl transition-all duration-1000`}
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div 
          className={`absolute w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-purple-400/30'} rounded-full blur-3xl transition-all duration-1000`}
          style={{
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
          }}
        />
        <div className={`absolute inset-0 ${isDark ? 'opacity-30' : 'opacity-20'} bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]`} />
      </div>

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="home" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          {mounted && [...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 ${isDark ? 'bg-blue-400/20' : 'bg-blue-500/30'} rounded-full animate-pulse`}
              style={{
                left: `${(i * 17 + 10) % 90}%`,
                top: `${(i * 23 + 15) % 80}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <div className={`inline-block mb-6 px-6 py-2 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20' : 'bg-white/50 border-blue-300/50'} border rounded-full backdrop-blur-sm animate-fade-in`}>
            <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>🚀 Profesjonalne strony internetowe</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight animate-fade-in-up">
            <span className={`block ${isDark ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent pb-2`}>
              Nowoczesne strony123
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse pb-2">
              które sprzedają
            </span>
          </h1>
          
          <p className={`text-lg sm:text-xl md:text-2xl ${textSecondary} mb-12 leading-relaxed max-w-4xl mx-auto animate-fade-in-up px-4`} style={{ animationDelay: '0.2s' }}>
            Tworzymy strony internetowe, które przyciągają uwagę, budują zaufanie i przekształcają odwiedzających w klientów. Bez zbędnych dodatków – konkretnie i skutecznie. Każdy projekt to połączenie najnowszych technologii z unikalnym designem.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
            <a
              href="#kontakt"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                Darmowa wycena
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a
              href="#oferta"
              className={`px-10 py-5 border-2 ${isDark ? 'border-blue-500/50 hover:bg-blue-500/10 hover:border-blue-400' : 'border-blue-400 hover:bg-blue-50'} rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              Zobacz ofertę
            </a>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {[
              { num: '50+', label: 'Zadowolonych klientów' },
              { num: '7-14', label: 'Dni realizacji' },
              { num: '100%', label: 'Satysfakcji' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {stat.num}
                </div>
                <div className={`${textSecondary} mt-2 text-sm sm:text-base`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Dlaczego warto z nami współpracować?
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4`}>
              Stawiamy na jakość, szybkość i rezultaty. Każdy projekt traktujemy indywidualnie, 
              dbając o najdrobniejsze szczegóły i Twoje zadowolenie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className={`group relative p-8 ${cardBg} backdrop-blur-sm rounded-3xl border ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-300'} transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {benefit.icon}
                  </div>
                  <h3 className={`font-bold text-2xl mb-4 ${textPrimary} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all pb-1`}>
                    {benefit.title}
                  </h3>
                  <p className={`${textSecondary} leading-relaxed`}>{benefit.description}</p>
                </div>

                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section id="oferta" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Nasza oferta
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4`}>
              Wybierz pakiet idealny dla Twojego biznesu. Każda oferta jest w pełni konfigurowalna 
              i możemy ją dostosować do Twoich indywidualnych potrzeb.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer, i) => (
              <div
                key={i}
                className={`relative p-10 rounded-3xl transition-all duration-500 hover:-translate-y-4 ${
                  offer.featured
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-purple-500/30 scale-105'
                    : isDark
                    ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
              >
                {offer.featured && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                    ⭐ Najpopularniejszy
                  </div>
                )}

                <div className="text-5xl mb-6">{offer.icon}</div>
                
                <h3 className={`font-black text-3xl mb-4 ${offer.featured ? 'text-white' : textPrimary} pb-1`}>{offer.title}</h3>
                
                <div className="mb-6">
                  <span className={`text-6xl font-black ${offer.featured ? 'text-white' : textPrimary}`}>
                    {offer.price}
                  </span>
                  <span className={`text-2xl ${offer.featured ? 'text-gray-200' : textSecondary}`}> zł</span>
                </div>

                <p className={`mb-8 leading-relaxed ${offer.featured ? 'text-blue-100' : textSecondary}`}>
                  {offer.description}
                </p>

                <ul className="space-y-4 mb-10">
                  {offer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/item">
                      <svg className={`w-6 h-6 mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110 ${offer.featured ? 'text-blue-200' : 'text-green-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={offer.featured ? 'text-white' : textPrimary}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signin"
                  className={`block text-center py-4 rounded-2xl font-bold transition-all duration-300 ${
                    offer.featured
                      ? 'bg-white text-purple-600 hover:bg-blue-50 hover:scale-105'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50'
                  }`}
                >
                  Wybierz pakiet
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Jak wygląda współpraca
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4`}>
              Prosty i przejrzysty proces w 4 krokach. Dbamy o transparentność 
              i regularną komunikację na każdym etapie realizacji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />

            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative inline-block mb-6">
                  <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center text-5xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {step.icon}
                  </div>
                  <div className={`absolute -top-3 -right-3 w-12 h-12 ${isDark ? 'bg-slate-900 border-blue-400' : 'bg-white border-blue-500'} border-2 rounded-full flex items-center justify-center font-black text-xl shadow-xl`}>
                    {i + 1}
                  </div>
                </div>
                
                <h3 className={`font-bold text-2xl mb-3 ${textPrimary} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all pb-1`}>
                  {step.title}
                </h3>
                <p className={`${textSecondary} leading-relaxed`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Co mówią nasi klienci
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4`}>
              Dołącz do grona zadowolonych firm, które zaufały naszemu doświadczeniu 
              i profesjonalizmowi w tworzeniu stron internetowych.
            </p>
          </div>

          <ReviewsCarousel 
            isDark={isDark}
            textSecondary={textSecondary}
            textPrimary={textPrimary}
          />

          <div className="text-center mt-16">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 text-white"
            >
              Zobacz pełne portfolio
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Najczęstsze pytania
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4`}>
              Wszystko co musisz wiedzieć o naszych usługach. Jeśli nie znajdziesz 
              odpowiedzi na swoje pytanie, skontaktuj się z nami bezpośrednio.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${cardBg} backdrop-blur-sm rounded-2xl border ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-300'} transition-all duration-300 overflow-hidden group`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full p-8 text-left font-bold text-xl ${textPrimary} hover:text-blue-400 transition-colors flex justify-between items-center`}
                >
                  <span className="pr-4">{faq.q}</span>
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity`} />
                    <div className={`relative w-10 h-10 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} rounded-full flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-gradient-to-r from-blue-500 to-purple-500' : ''}`}>
                      <svg
                        className={`w-6 h-6 transition-all ${openFaq === i ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-8 pb-8 ${textSecondary} leading-relaxed ${isDark ? 'border-slate-800' : 'border-gray-200'} border-t pt-6`}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="kontakt" className="relative py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-16">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Zamów swoją stronę
            </h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto px-4 mb-8`}>
              Gotów na nową stronę internetową? Zaloguj się i zamów ją w kilku prostych krokach.
            </p>
          </div>

          <div className={`space-y-4 ${cardBg} backdrop-blur-sm p-10 rounded-3xl border shadow-2xl ${isDark ? 'shadow-purple-500/10' : 'shadow-blue-500/10'}`}>
            <Link
              href="/auth/signin"
              className="block w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-all text-center"
            >
              Zaloguj i zamów
            </Link>
            <p className={`text-sm ${textSecondary}`}>
              Nie masz konta? 
              <Link href="/auth/signup" className="text-blue-600 hover:underline ml-1">
                Zarejestruj się
              </Link>
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20" />
          
          <div className={`relative ${cardBg} backdrop-blur-sm p-16 rounded-3xl border`}>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 ${isDark ? 'bg-gradient-to-r from-white to-gray-300' : 'bg-gradient-to-r from-gray-900 to-gray-700'} bg-clip-text text-transparent pb-2`}>
              Gotowy na nową stronę?
            </h2>
            <p className={`text-xl ${textPrimary} mb-10 max-w-2xl mx-auto px-4`}>
              Skontaktuj się z nami już dziś i otrzymaj darmową wycenę w 24h. 
              Razem stworzymy stronę, która wyróżni Twój biznes w sieci.
            </p>
            <a
              href="#kontakt"
              className="inline-block px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 text-white"
            >
              Napisz do nas
            </a>
          </div>
        </div>
      </section>

      <Footer isDark={isDark} currentPage="home" />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}