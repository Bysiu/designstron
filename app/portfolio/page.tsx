'use client';

import { useState, useEffect } from 'react';
import portfolioData from '@/components/portfolioData.json';
import NavbarAuth from '@/components/NavbarAuth';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PortfolioPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="portfolio" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <div className={`inline-block mb-6 px-6 py-2 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20' : 'bg-white/50 border-blue-300/50'} border rounded-full backdrop-blur-sm`}>
            <span className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>🎨 Nasze realizacje</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className={`block ${isDark ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900'} bg-clip-text text-transparent pb-2`}>
              Portfolio
            </span>
          </h1>
          
          <p className={`text-lg sm:text-xl md:text-2xl ${textSecondary} max-w-3xl mx-auto leading-relaxed px-4`}>
            Zobacz projekty, które stworzyliśmy dla naszych klientów. 
            Każda strona to unikalne rozwiązanie dopasowane do potrzeb biznesu.
          </p>
        </div>
      </section>

      {/* === DEMO PROJECTS SECTION (DODANE) === */}
      {portfolioData.demoProjects && (
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12">Projekty DEMO</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.demoProjects.map((demo, i) => (
                <Link
                  key={demo.id}
                  href={demo.href}
                  className={`group relative ${cardBg} backdrop-blur-sm rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={demo.image}
                      alt={demo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      DEMO
                    </span>
                  </div>

                  <div className="p-8">
                    <h3 className={`font-bold text-2xl mb-3 ${textPrimary}`}>
                      {demo.title}
                    </h3>
                    <p className={`${textSecondary} mb-4 leading-relaxed`}>
                      {demo.description}
                    </p>
                    <span className="text-blue-400 font-semibold">
                      Zobacz demo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Grid (ORYGINALNY – NIETKNIĘTY) */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, i) => (
              <div
                key={project.id}
                className={`group relative ${cardBg} backdrop-blur-sm rounded-3xl border ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-300'} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.websiteImage}
                    alt={project.companyName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 flex items-center gap-2"
                  >
                    Odwiedź stronę
                  </a>
                </div>

                <div className="p-8">
                  <h3 className={`font-bold text-2xl mb-3 ${textPrimary}`}>
                    {project.companyName}
                  </h3>
                  <p className={`${textSecondary} mb-4`}>
                    {project.projectDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer isDark={isDark} currentPage="portfolio" />
    </div>
  );
}
