'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Ile kosztuje strona internetowa?',
    a: 'Cena strony zależy od jej rodzaju i zakresu. Prosta strona wizytówka kosztuje od 800 zł, strony firmowe od 1500 zł, a landing page od 1000 zł. Dokładną wycenę przygotowujemy po krótkiej rozmowie.',
  },
  {
    q: 'Ile trwa wykonanie strony?',
    a: 'Standardowy czas realizacji to od 7 do 14 dni roboczych. Bardziej rozbudowane projekty mogą zająć nieco dłużej — wszystko ustalamy indywidualnie.',
  },
  {
    q: 'Czy strona będzie działać na telefonach?',
    a: 'Tak. Wszystkie nasze strony są w pełni responsywne i poprawnie wyświetlają się na smartfonach, tabletach i komputerach.',
  },
  {
    q: 'Czy będę mógł samodzielnie edytować stronę?',
    a: 'Tak. Tworzymy strony w taki sposób, aby można było łatwo zmieniać treści lub rozbudowywać projekt w przyszłości.',
  },
  {
    q: 'Czy pomagacie z domeną i hostingiem?',
    a: 'Tak. Możemy doradzić w wyborze domeny, hostingu oraz pomóc w konfiguracji technicznej strony.',
  },
  {
    q: 'Czy wystawiacie fakturę?',
    a: 'Działamy w ramach działalności nierejestrowanej. Wystawiamy umowy oraz rachunki zgodnie z obowiązującymi przepisami.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">
        Najczęściej zadawane pytania
      </h2>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border rounded-lg p-5 cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <h3 className="font-semibold text-lg">{item.q}</h3>
            {open === i && (
              <p className="mt-3 text-gray-600 leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
