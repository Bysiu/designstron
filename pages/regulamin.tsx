'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';
import Footer from '@/components/Footer';

export default function Regulamin() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const bgClass = isDark ? 'bg-slate-950' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      <Head>
        <title>Regulamin - Designstron.pl</title>
        <meta name="description" content="Regulamin świadczenia usług przez Designstron.pl" />
      </Head>

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="regulamin" />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-black mb-8 ${textPrimary}`}>
            Regulamin
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Designstron.pl
            </span>
          </h1>

          <div className="space-y-8">
            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§1. Postanowienia ogólne</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>1.1. Regulamin określa zasady świadczenia usług przez Designstron.pl w zakresie tworzenia stron internetowych.</p>
                <p>1.2. Administratorem serwisu jest Designstron.pl, ul. Przykładowa 123, 00-000 Warszawa, NIP: 1234567890.</p>
                <p>1.3. Usługi świadczone są na terytorium Rzeczypospolitej Polskiej oraz innych krajów w ramach realizacji projektów zdalnych.</p>
                <p>1.4. Niniejszy regulamin jest dostępny pod adresem: designstron.pl/regulamin.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§2. Definicje</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p><strong>2.1. Usługa:</strong> Tworzenie strony internetowej, w tym projektowanie, programowanie, wdrożenie oraz wsparcie techniczne.</p>
                <p><strong>2.2. Klient:</strong> Osoba fizyczna, prawna lub jednostka organizacyjna, która zleca wykonanie Usługi.</p>
                <p><strong>2.3. Projekt:</strong> Indywidualnie określony zakres prac tworzenia strony internetowej.</p>
                <p><strong>2.4. Umowa:</strong> Umowa o świadczenie usług zawarta między Designstron.pl a Klientem.</p>
                <p><strong>2.5. Wycena:</strong> Szacunkowy koszt wykonania Usługi przedstawiony Klientowi.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§3. Zasady współpracy</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>3.1. Klient składa zapytanie o usługę poprzez formularz kontaktowy lub bezpośredni kontakt.</p>
                <p>3.2. Designstron.pl przedstawia wycenę projektu w ciągu 2 dni roboczych.</p>
                <p>3.3. Akceptacja wyceny przez Klienta jest równoznaczna z zawarciem umowy.</p>
                <p>3.4. Prace rozpoczynają się po wpłacie zaliczki w wysokości 30% wartości projektu.</p>
                <p>3.5. Czas realizacji projektu wynosi od 14 do 60 dni w zależności od złożoności.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§4. Płatności</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>4.1. Płatności przyjmowane są w formie przelewu bankowego lub szybkich płatności online.</p>
                <p>4.2. Harmonogram płatności:</p>
                <ul className="ml-6 space-y-2">
                  <li>• 30% zaliczka przed rozpoczęciem prac</li>
                  <li>• 40% po akceptacji projektu graficznego</li>
                  <li>• 30% po wdrożeniu strony</li>
                </ul>
                <p>4.3. W przypadku opóźnienia w płatności powyżej 7 dni, naliczane są odsetki ustawowe.</p>
                <p>4.4. Faktury VAT wystawiane są w ciągu 3 dni od otrzymania płatności.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§5. Prawa i obowiązki stron</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p><strong>5.1. Obowiązki Designstron.pl:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Wykonanie projektu zgodnie z uzgodnionymi założeniami</li>
                  <li>• Zapewnienie wsparcia technicznego przez 12 miesięcy</li>
                  <li>• Przekazanie praw autorskich po pełnej zapłacie</li>
                  <li>• Dbanie o bezpieczeństwo strony</li>
                </ul>
                <p><strong>5.2. Obowiązki Klienta:</strong></p>
                <ul className="ml-6 space-y-2">
                  <li>• Terminowe dokonywanie płatności</li>
                  <li>• Dostarczenie materiałów (teksty, zdjęcia, logo)</li>
                  <li>• Aktywne uczestnictwo w procesie projektowym</li>
                  <li>• Testowanie funkcjonalności strony</li>
                </ul>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§6. Gwarancja i wsparcie techniczne</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>6.1. Designstron.pl udziela 12-miesięcznej gwarancji na poprawne działanie strony.</p>
                <p>6.2. Gwarancja nie obejmuje uszkodzeń wynikających z nieprawidłowego użytkowania.</p>
                <p>6.3. Wsparcie techniczne obejmuje:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Poprawki błędów technicznych</li>
                  <li>• Aktualizacje systemu CMS</li>
                  <li>• Konsultacje techniczne</li>
                </ul>
                <p>6.4. Po upływie gwarancji, wsparcie techniczne jest odpłatne.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§7. Odstąpienie od umowy</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>7.1. Klient ma prawo odstąpić od umowy w ciągu 14 dni od jej zawarcia.</p>
                <p>7.2. W przypadku odstąpienia, Klient ponosi koszty wykonanych prac.</p>
                <p>7.3. Designstron.pl może odstąpić od umowy w przypadku:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Braku współpracy ze strony Klienta</li>
                  <li>• Opóźnień w płatnościach powyżej 14 dni</li>
                  <li>• Siły wyższej uniemożliwiającej realizację</li>
                </ul>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§8. Ochrona danych osobowych</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>8.1. Dane osobowe Klientów są przetwarzane zgodnie z RODO.</p>
                <p>8.2. Administratorem danych jest Designstron.pl.</p>
                <p>8.3. Dane są przetwarzane w celu realizacji umowy i marketingu.</p>
                <p>8.4. Klient ma prawo dostępu, poprawiania i usunięcia danych.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§9. Postanowienia końcowe</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>9.1. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy Kodeksu Cywilnego.</p>
                <p>9.2. Sądem właściwym do rozstrzygania sporów jest sąd miejsca siedziby Designstron.pl.</p>
                <p>9.3. Regulamin wchodzi w życie z dniem 01.01.2024.</p>
                <p>9.4. Designstron.pl zastrzega sobie prawo do zmiany regulaminu.</p>
              </div>
            </section>
          </div>

          <div className={`mt-12 p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'} border rounded-xl`}>
            <p className={`${textSecondary} text-center`}>
              Data ostatniej aktualizacji: 27.12.2024<br />
              W razie pytań prosimy o kontakt: kontakt@designstron.pl
            </p>
          </div>
        </div>
      </div>

      <Footer isDark={isDark} currentPage="regulamin" />
    </div>
  );
}
