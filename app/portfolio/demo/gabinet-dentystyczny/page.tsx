'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Calendar, Clock, User, Star, Phone, MapPin, Shield, Award, Heart, CheckCircle, ArrowRight, ChevronDown, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function GabinetDentystyczny() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Usługi', href: '#services' },
    { label: 'Rezerwacja', href: '#booking' },
    { label: 'Zespół', href: '#team' },
    { label: 'Opinie', href: '#testimonials' },
    { label: 'Kontakt', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const services = [
    { 
      name: 'Przegląd i konsultacja', 
      price: '150 zł', 
      duration: '30 min',
      icon: '🦷',
      description: 'Kompleksowa diagnostyka jamy ustnej z RTG',
      color: 'from-blue-500 to-cyan-500',
      details: ['Badanie kliniczne', 'Zdjęcie RTG', 'Plan leczenia', 'Konsultacja']
    },
    { 
      name: 'Wypełnienie zęba', 
      price: '200-400 zł', 
      duration: '45 min',
      icon: '🔧',
      description: 'Materiały kompozytowe najwyższej jakości',
      color: 'from-cyan-500 to-teal-500',
      details: ['Znieczulenie', 'Usunięcie próchnicy', 'Wypełnienie kompozytowe', 'Polerowanie']
    },
    { 
      name: 'Scaling i piaskowanie', 
      price: '250 zł', 
      duration: '60 min',
      icon: '✨',
      description: 'Profesjonalne czyszczenie ultradźwiękami',
      color: 'from-teal-500 to-emerald-500',
      details: ['Usuwanie kamienia', 'Piaskowanie', 'Fluoryzacja', 'Polerowanie']
    },
    { 
      name: 'Wybielanie zębów', 
      price: '800 zł', 
      duration: '90 min',
      icon: '💎',
      description: 'Bezpieczne wybielanie lampą LED Beyond',
      color: 'from-blue-600 to-purple-600',
      details: ['Ochrona dziąseł', 'Aplikacja żelu', 'Naświetlanie LED', 'Mineralizacja']
    },
    { 
      name: 'Leczenie kanałowe', 
      price: '600-1200 zł', 
      duration: '120 min',
      icon: '🔬',
      description: 'Endodoncja z mikroskopem Zeiss',
      color: 'from-purple-600 to-pink-600',
      details: ['Znieczulenie', 'Oczyszczanie kanałów', 'Wypełnienie', 'Kontrola RTG']
    },
    { 
      name: 'Ekstrakcja zęba', 
      price: '300 zł', 
      duration: '30 min',
      icon: '🏥',
      description: 'Bezbolesne usuwanie z znieczuleniem',
      color: 'from-pink-600 to-rose-600',
      details: ['Znieczulenie', 'Usunięcie zęba', 'Opatrunek', 'Zalecenia']
    },
  ];

  const appointments = [
    { date: '2025-01-15', time: '10:00', service: 'Przegląd', doctor: 'Dr Anna Kowalska', status: 'confirmed', price: '150 zł' },
    { date: '2024-12-10', time: '14:30', service: 'Wypełnienie', doctor: 'Dr Jan Nowak', status: 'completed', price: '350 zł' },
    { date: '2024-11-20', time: '16:00', service: 'Scaling', doctor: 'Dr Anna Kowalska', status: 'completed', price: '250 zł' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  const doctors = [
    { 
      name: 'Dr Anna Kowalska', 
      specialization: 'Stomatologia estetyczna', 
      experience: '15 lat', 
      rating: 4.9, 
      patients: '2500+',
      image: '👩‍⚕️',
      description: 'Specjalistka w dziedzinie wybielania i estetyki',
      certifications: ['Implantologia', 'Protetyka', 'Estetyka']
    },
    { 
      name: 'Dr Jan Nowak', 
      specialization: 'Ortodoncja', 
      experience: '12 lat', 
      rating: 4.8, 
      patients: '1800+',
      image: '👨‍⚕️',
      description: 'Expert w zakresie aparatów ortodontycznych',
      certifications: ['Ortodoncja', 'Ortodoncja niewidoczna', 'Chirurgia']
    },
    { 
      name: 'Dr Maria Wiśniewska', 
      specialization: 'Chirurgia stomatologiczna', 
      experience: '18 lat', 
      rating: 5.0, 
      patients: '3200+',
      image: '👩‍⚕️',
      description: 'Pionierka w zakresie implantologii',
      certifications: ['Chirurgia', 'Implantologia', 'Periodontologia']
    },
  ];

  const testimonials = [
    {
      name: 'Katarzyna M.',
      rating: 5,
      text: 'Fantastyczna obsługa! Dr Kowalska przeprowadziła mnie przez cały proces wybielania. Jestem zachwycona efektami!',
      service: 'Wybielanie zębów',
      date: '2024-12-15'
    },
    {
      name: 'Tomasz K.',
      rating: 5,
      text: 'Profesjonalizm na najwyższym poziomie. Leczenie kanałowe przebiegło całkowicie bezbolesnie. Polecam!',
      service: 'Leczenie kanałowe',
      date: '2024-12-10'
    },
    {
      name: 'Anna W.',
      rating: 5,
      text: 'Nowoczesny sprzęt, przyjazna atmosfera. Wreszcie gabinet, do którego chce się przychodzić.',
      service: 'Przegląd',
      date: '2024-12-05'
    }
  ];

  const handleAction = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !selectedDoctor) {
      alert('Proszę wypełnić wszystkie pola');
      return;
    }
    handleAction();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{ transform: `translate(${-mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute -bottom-32 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{ transform: `translate(${mousePosition.x}px, ${-mousePosition.y}px)` }}
        />
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-in-right flex items-center gap-3 backdrop-blur-lg border border-blue-400">
          <div className="relative">
            <CheckCircle className="w-6 h-6 animate-scale-in" />
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
          </div>
          <span className="font-semibold">To jest wersja demo – funkcja pokazowa</span>
        </div>
      )}

      {/* Header with Glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-blue-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  DC
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">DentalCare</h1>
                <p className="text-xs text-gray-500">Profesjonalna opieka</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.href} 
                  className="relative text-gray-700 font-medium group py-2 overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              {!isLoggedIn ? (
                <button
                  onClick={() => { setIsLoggedIn(true); handleAction(); }}
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                  <span className="relative z-10">Panel Pacjenta</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                >
                  Wyloguj
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden relative w-10 h-10 flex items-center justify-center group" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-5">
                <span className={`absolute w-full h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`} />
                <span className={`absolute top-2 w-full h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-full h-0.5 bg-gray-900 transition-all duration-300 ${mobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-3 pb-4">
              {navItems.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:translate-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Badge */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 py-2 z-30 animate-gradient-x">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-900 animate-pulse">
            🎨 Projekt koncepcyjny – wersja demo | Portfolio designstron.pl
          </p>
        </div>
      </div>

      <main className="pt-24 mt-8 relative z-10">
        {!isLoggedIn ? (
          <>
            {/* Hero Section */}
            <section ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 md:space-y-8 animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-200 transition-colors duration-300 cursor-pointer hover:scale-105">
                    <Award className="w-4 h-4 animate-bounce" />
                    Certyfikowany zespół specjalistów
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Twój uśmiech w{' '}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                        dobrych rękach
                      </span>
                      <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                        <path d="M0 4 Q 50 0, 100 4 T 200 4" stroke="url(#gradient)" strokeWidth="3" fill="none" className="animate-draw-line"/>
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Profesjonalna opieka stomatologiczna z wykorzystaniem najnowszych technologii. 
                    Bezbolesne leczenie w komfortowych warunkach.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-base md:text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Umów wizytę online
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </button>
                    <a 
                      href="tel:123456789"
                      className="group px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 hover:bg-blue-50 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      123 456 789
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-8 pt-4">
                    {[
                      { value: '2500+', label: 'Zadowolonych pacjentów' },
                      { value: '15 lat', label: 'Doświadczenia' },
                      { value: '4.9⭐', label: 'Średnia ocen' }
                    ].map((stat, idx) => (
                      <div key={idx} className="group cursor-pointer hover:scale-110 transition-transform duration-300">
                        <div className="text-2xl md:text-3xl font-bold text-blue-600 group-hover:text-cyan-600 transition-colors">{stat.value}</div>
                        <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 3D Card */}
                <div className="relative animate-fade-in-up animation-delay-200 perspective-1000">
                  <div 
                    className="relative z-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 md:p-8 shadow-2xl transform-gpu hover:scale-105 transition-all duration-500"
                    style={{
                      transform: `rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`
                    }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      <div className="text-center relative z-10">
                        <div className="text-6xl md:text-9xl mb-4 animate-float">🦷</div>
                        <p className="text-lg md:text-xl font-semibold text-gray-700">Nowoczesny gabinet</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl -z-10 blur-sm" />
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyan-400 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-1000" />
                </div>
              </div>

              <div className="flex justify-center mt-12 md:mt-16 animate-bounce">
                <ChevronDown className="w-8 h-8 text-blue-600" />
              </div>
            </section>

            {/* Features */}
            <section className="bg-white/50 backdrop-blur-sm py-12 md:py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {[
                    { icon: Shield, title: 'Sterylizacja', desc: 'Najwyższe standardy', color: 'from-blue-500 to-cyan-500' },
                    { icon: Award, title: 'Certyfikaty', desc: 'Doświadczeni specjaliści', color: 'from-cyan-500 to-teal-500' },
                    { icon: Heart, title: 'Komfort', desc: 'Bezbolesne leczenie', color: 'from-teal-500 to-emerald-500' },
                    { icon: Clock, title: 'Punktualność', desc: 'Szanujemy Twój czas', color: 'from-emerald-500 to-green-500' },
                  ].map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="group text-center p-4 md:p-6 rounded-2xl hover:bg-blue-50 transition-all duration-500 animate-fade-in-up cursor-pointer transform-gpu hover:scale-110 hover:-translate-y-2" 
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                        <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Services */}
            <section id="services" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Nasze usługi</h3>
                <p className="text-lg md:text-xl text-gray-600">Kompleksowa opieka stomatologiczna</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {services.map((service, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-fade-in-up cursor-pointer overflow-hidden transform-gpu hover:scale-105 hover:-translate-y-2"
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onMouseEnter={() => setActiveService(idx)}
                    onMouseLeave={() => setActiveService(null)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-colors duration-500" />
                    
                    <div className="relative z-10">
                      <div className="text-4xl md:text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">{service.icon}</div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{service.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{service.description}</p>
                      <div className="flex items-center justify-between mb-6">
                        <span className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>{service.price}</span>
                        <span className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.duration}
                        </span>
                      </div>
                      
                      <div className={`transition-all duration-500 overflow-hidden ${activeService === idx ? 'max-h-32 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {service.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedService(service.name);
                          document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full group relative px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Zarezerwuj
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 md:mt-14 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-6 md:p-10 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:22px_22px]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold text-white/90">Pierwsza wizyta?</p>
                    <h4 className="text-2xl md:text-3xl font-bold">Dobierzemy plan leczenia i terminy w 5 minut.</h4>
                    <p className="mt-2 text-white/85 max-w-2xl">Wybierz usługę, lekarza i godzinę. Resztę potwierdzimy SMS-em. To demo — kliknięcia tylko pokazowe.</p>
                  </div>
                  <button
                    onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-7 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105"
                  >
                    Przejdź do rezerwacji
                  </button>
                </div>
              </div>
            </section>

            {/* Booking */}
            <section id="booking" className="py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  <div className="lg:col-span-5">
                    <div className="sticky top-28">
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Rezerwacja wizyty</h3>
                            <p className="mt-2 text-gray-600">Wybierz termin, godzinę, usługę i lekarza.</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-2 rounded-full">
                            <SparkleInline />
                            Premium
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  style={{ colorScheme: 'light' }}
                                  className="no-global-form w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Godzina</label>
                              <div className="grid grid-cols-4 gap-2">
                                {timeSlots.map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-xl border px-2 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                      selectedTime === time
                                        ? 'border-transparent bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Usługa</label>
                            <select
                              value={selectedService}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedService(e.target.value)}
                              className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                            >
                              <option value="">Wybierz usługę…</option>
                              {services.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {s.name} ({s.price})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Lekarz</label>
                            <select
                              value={selectedDoctor}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDoctor(e.target.value)}
                              className="no-global-form w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                            >
                              <option value="">Wybierz specjalistę…</option>
                              {doctors.map((d) => (
                                <option key={d.name} value={d.name}>
                                  {d.name} • {d.specialization}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Imię i nazwisko</label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Jan Kowalski"
                                  className="no-global-form w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="tel"
                                  placeholder="123 456 789"
                                  className="no-global-form w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleBooking}
                            className="group w-full mt-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
                          >
                            <span className="flex items-center justify-center gap-2">
                              Potwierdź rezerwację
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                          </button>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <p className="text-xs text-gray-600">Czas odpowiedzi</p>
                              <p className="text-lg font-bold text-gray-900">~5 min</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <p className="text-xs text-gray-600">Płatność</p>
                              <p className="text-lg font-bold text-gray-900">online / na miejscu</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900">Jak wygląda wizyta?</h4>
                      <p className="mt-2 text-gray-600">Jasny plan, przewidywalny koszt i komfort na każdym etapie.</p>

                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Diagnostyka', desc: 'Badanie + plan leczenia', icon: Calendar },
                          { title: 'Bez bólu', desc: 'Nowoczesne znieczulenia', icon: Heart },
                          { title: 'Sterylizacja', desc: 'Procedury klasy medycznej', icon: Shield },
                          { title: 'Dokumentacja', desc: 'Wyniki i zalecenia', icon: Award },
                        ].map((step, idx) => (
                          <div key={idx} className="group rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <step.icon className="w-5 h-5" />
                            </div>
                            <p className="mt-4 font-bold text-gray-900">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="text-sm text-white/75">Masz pytania?</p>
                            <p className="text-xl md:text-2xl font-bold">Zadzwoń: 123 456 789</p>
                            <p className="text-sm text-white/75 mt-1">Pon–Pt 8:00–18:00</p>
                          </div>
                          <a
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition"
                          >
                            Kontakt i dojazd
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Team */}
            <section id="team" className="py-12 md:py-20 bg-white/50 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Poznaj nasz zespół</h3>

                    <p className="mt-2 text-gray-600">Specjaliści, którym możesz zaufać — technologie i empatia.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                      <p className="text-xs text-gray-600">Średnia ocen</p>
                      <p className="text-lg font-bold text-gray-900">4.9/5</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                      <p className="text-xs text-gray-600">Pacjentów</p>
                      <p className="text-lg font-bold text-gray-900">2500+</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {doctors.map((d) => (
                    <div key={d.name} className="group bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-7 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {d.image}

                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{d.name}</p>
                            <p className="text-sm text-gray-600">{d.specialization}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Doświadczenie</p>
                          <p className="font-bold text-gray-900">{d.experience}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-gray-600">{d.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-gray-900">{d.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-600">({d.patients})</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDoctor(d.name);
                            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
                        >
                          Wybierz
                        </button>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {d.certifications.map((c) => (
                          <span key={c} className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-14">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Opinie pacjentów</h3>
                  <p className="mt-2 text-gray-600">Prawdziwe wrażenia i rezultaty — w wersji demo.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-7 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-900">{t.name}</p>
                          <p className="text-sm text-gray-600">{t.service}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-4 text-gray-700 leading-relaxed">{t.text}</p>
                      <p className="mt-4 text-xs text-gray-500">{t.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="py-12 md:py-20 bg-white/50 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  <div className="lg:col-span-5">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">FAQ</h3>
                    <p className="mt-2 text-gray-600">Najczęstsze pytania przed wizytą.</p>
                  </div>
                  <div className="lg:col-span-7 space-y-3">
                    {[
                      { q: 'Czy wizyta jest bezbolesna?', a: 'Stosujemy nowoczesne znieczulenia i techniki minimalnie inwazyjne. W demie to tylko prezentacja.' },
                      { q: 'Jak szybko dostanę termin?', a: 'Najczęściej w ciągu kilku dni. System rezerwacji pokazuje dostępne godziny.' },
                      { q: 'Czy mogę zapłacić online?', a: 'Tak — online lub na miejscu. Po rezerwacji dostaniesz potwierdzenie SMS.' },
                      { q: 'Czy dostanę plan leczenia?', a: 'Po diagnostyce otrzymasz jasny plan, koszt i etapy leczenia.' },
                    ].map((item, idx) => (
                      <details key={idx} className="group bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                          <span className="font-bold text-gray-900 group-open:text-blue-600 transition-colors">{item.q}</span>
                          <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">+</span>
                        </summary>
                        <p className="mt-3 text-gray-600">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
                  <div className="lg:col-span-5">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Kontakt</h3>
                    <p className="mt-2 text-gray-600">Umów wizytę lub dopytaj o szczegóły.</p>

                    <div className="mt-6 space-y-4">
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Telefon</p>
                            <a href="tel:123456789" className="text-blue-700 font-semibold">123 456 789</a>
                            <p className="text-sm text-gray-600">Pon–Pt 8:00–18:00</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Email</p>
                            <p className="text-gray-700 font-semibold">kontakt@dentalcare.pl</p>
                            <p className="text-sm text-gray-600">Odpowiadamy w ~5 min</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Adres</p>
                            <p className="text-gray-700 font-semibold">ul. Zdrowia 15, Rzeszów</p>
                            <p className="text-sm text-gray-600">Parking + winda</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      {[{ Icon: Facebook, label: 'Facebook' }, { Icon: Instagram, label: 'Instagram' }, { Icon: Youtube, label: 'YouTube' }].map(({ Icon, label }) => (
                        <button key={label} onClick={handleAction} className="w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition flex items-center justify-center text-gray-700 hover:text-blue-700">
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                      <div className="p-6 md:p-8 border-b border-gray-100">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900">Dojazd</h4>
                        <p className="mt-1 text-gray-600">Mapa poglądowa (demo).</p>
                      </div>
                      <div className="aspect-[16/10] md:aspect-video bg-gray-100">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.5!2d21.9992!3d50.0412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDAyJzI4LjMiTiAyMcKwNTknNTcuMSJF!5e0!3m2!1spl!2spl!4v1234567890"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="py-10 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold flex items-center justify-center">DC</div>
                    <div>
                      <p className="font-bold text-gray-900">DentalCare</p>
                      <p className="text-sm text-gray-600">Nowoczesny gabinet stomatologiczny (DEMO)</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} designstron.pl • Strona demo</p>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-7">
                  <h2 className="text-2xl font-bold text-gray-900">Panel Pacjenta</h2>
                  <p className="mt-1 text-gray-600">Szybki podgląd wizyt i płatności (demo).</p>

                  <div className="mt-6 space-y-3">
                    <button onClick={handleAction} className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg hover:shadow-2xl transition">Nowa rezerwacja</button>
                    <button onClick={handleAction} className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition">Pobierz historię leczenia (PDF)</button>
                    <button onClick={() => setIsLoggedIn(false)} className="w-full px-5 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">Wyloguj</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Twoje wizyty</h3>
                      <p className="mt-1 text-gray-600">Zarządzaj terminami i płatnościami.</p>
                    </div>
                    <button onClick={handleAction} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition">
                      Płatność
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {appointments.map((apt, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:bg-white transition">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900">{apt.service}</p>
                            <p className="text-sm text-gray-600">{apt.doctor}</p>
                            <p className="text-sm text-gray-600">{apt.date} • {apt.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                              {apt.status === 'confirmed' ? 'Potwierdzona' : 'Zakończona'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-white text-gray-900 border-gray-200">{apt.price}</span>
                          </div>
                        </div>
                        {apt.status === 'confirmed' && (
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button onClick={handleAction} className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">Zapłać online</button>
                            <button onClick={handleAction} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition">Zmień termin</button>
                            <button onClick={handleAction} className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 transition">Anuluj</button>
                          </div>
                        )}
                      </div>
                    ))}
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

function SparkleInline() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30">
      <span className="w-2 h-2 rounded-full bg-white" />
    </span>
  );
}