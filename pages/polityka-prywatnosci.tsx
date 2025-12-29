'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavbarAuth from '@/components/NavbarAuth';
import Footer from '@/components/Footer';

export default function PolitykaPrywatnosci() {
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
        <title>Polityka Prywatności - Designstron.pl</title>
        <meta name="description" content="Polityka prywatności i ochrony danych osobowych Designstron.pl" />
      </Head>

      <NavbarAuth isDark={isDark} setIsDark={setIsDark} currentPage="polityka-prywatnosci" />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-black mb-8 ${textPrimary}`}>
            Polityka Prywatności
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Designstron.pl
            </span>
          </h1>

          <div className="space-y-8">
            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§1. Informacje podstawowe</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>1.1. Administratorem Pani/Pana danych osobowych jest Designstron.pl, ul. Przykładowa 123, 00-000 Warszawa, NIP: 1234567890.</p>
                <p>1.2. Kontakt z Inspektorem Ochrony Danych: iod@designstron.pl</p>
                <p>1.3. Pani/Pana dane osobowe będą przetwarzane zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).</p>
                <p>1.4. Niniejsza polityka prywatności obowiązuje od dnia 01.01.2024.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§2. Cel i zakres przetwarzania danych</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>2.1. Pani/Pana dane osobowe przetwarzamy w celu:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Realizacji usług tworzenia stron internetowych</li>
                  <li>• Nawiązania kontaktu i przedstawienia oferty</li>
                  <li>• Marketingu bezpośredniego własnych produktów i usług</li>
                  <li>• Rozliczeń finansowych i wystawiania faktur</li>
                  <li>• Utrzymania relacji biznesowych</li>
                </ul>
                <p>2.2. Zakres przetwarzanych danych obejmuje:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Dane identyfikacyjne (imię, nazwisko, nazwa firmy)</li>
                  <li>• Dane kontaktowe (adres e-mail, numer telefonu)</li>
                  <li>• Dane adresowe (ulica, kod pocztowy, miasto)</li>
                  <li>• Dane finansowe (NIP, REGON)</li>
                </ul>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§3. Podstawa prawna przetwarzania</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>3.1. Pani/Pana dane osobowe przetwarzamy na podstawie:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Art. 6 ust. 1 lit. a RODO – Pani/Pana zgody</li>
                  <li>• Art. 6 ust. 1 lit. b RODO – niezbędności do wykonania umowy</li>
                  <li>• Art. 6 ust. 1 lit. f RODO – prawnie uzasadnionego interesu administratora</li>
                  <li>• Art. 6 ust. 1 lit. c RODO – obowiązku prawnego</li>
                </ul>
                <p>3.2. Podanie danych osobowych jest dobrowolne, ale niezbędne do realizacji usług.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§4. Okres przechowywania danych</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>4.1. Pani/Pana dane osobowe będą przechowywane:</p>
                <ul className="ml-6 space-y-2">
                  <li>• W trakcie realizacji umowy – przez okres jej trwania</li>
                  <li>• Po zakończeniu umowy – przez 5 lat</li>
                  <li>• Dane księgowe – przez 5 lat od końca roku podatkowego</li>
                  <li>• Dane marketingowe – do momentu wycofania zgody</li>
                </ul>
                <p>4.2. Po upływie okresów przechowywania dane zostaną trwale usunięte.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§5. Odbiorcy danych</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>5.1. Pani/Pana dane osobowe mogą być udostępniane:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Podmiotom przetwarzającym dane na zlecenie administratora</li>
                  <li>• Dostawcom usług hostingowych</li>
                  <li>• Dostawcom systemów płatności</li>
                  <li>• Biurom rachunkowym</li>
                  <li>• Kancelariom prawnym</li>
                </ul>
                <p>5.2. Dane nie będą przekazywane do państw trzecich poza EOG.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§6. Prawa osób, których dane dotyczą</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>6.1. Przysługują Pani/Panu następujące prawa:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Dostępu do danych</li>
                  <li>• Sprostowania danych</li>
                  <li>• Usunięcia danych</li>
                  <li>• Ograniczenia przetwarzania</li>
                  <li>• Przenoszenia danych</li>
                  <li>• Sprzeciwu wobec przetwarzania</li>
                  <li>• Cofnięcia zgody</li>
                </ul>
                <p>6.2. Realizację praw można zgłosić na adres: iod@designstron.pl</p>
                <p>6.3. Przysługuje Pani/Panu prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§7. Pliki cookies</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>7.1. Serwis używa plików cookies w celu:</p>
                <ul className="ml-6 space-y-2">
                  <li>• Zapewnienia prawidłowego działania serwisu</li>
                  <li>• Analizy ruchu na stronie</li>
                  <li>• Personalizacji treści</li>
                  <li>• Pamiętań ustawień użytkownika</li>
                </ul>
                <p>7.2. Pliki cookies można wyłączyć w ustawieniach przeglądarki.</p>
                <p>7.3. Wyłączenie cookies może wpłynąć na funkcjonalność serwisu.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§8. Bezpieczeństwo danych</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>8.1. Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę danych.</p>
                <p>8.2. Dostęp do danych mają wyłącznie upoważnione osoby.</p>
                <p>8.3. Dane są zabezpieczone przed utratą, zniszczeniem lub nieuprawnionym dostępem.</p>
                <p>8.4. Regularnie przeprowadzane są audyty bezpieczeństwa.</p>
              </div>
            </section>

            <section className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-3xl border shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>§9. Zmiany polityki prywatności</h2>
              <div className={`space-y-3 ${textSecondary} leading-relaxed`}>
                <p>9.1. Administrator zastrzega sobie prawo do zmiany polityki prywatności.</p>
                <p>9.2. Zmiany będą publikowane na stronie i wchodzą w życie z dniem publikacji.</p>
                <p>9.3. W przypadku istotnych zmian użytkownicy zostaną poinformowani drogą mailową.</p>
              </div>
            </section>
          </div>

          <div className={`mt-12 p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'} border rounded-xl`}>
            <p className={`${textSecondary} text-center`}>
              Data ostatniej aktualizacji: 27.12.2024<br />
              W razie pytań prosimy o kontakt: iod@designstron.pl
            </p>
          </div>
        </div>
      </div>

      <Footer isDark={isDark} currentPage="polityka-prywatnosci" />
    </div>
  );
}
