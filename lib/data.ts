import { Benefit, OfferItem, Step, PortfolioItem, FAQItem } from '@/types';

export const benefits = [
  {
    icon: '✨',
    title: 'Nowoczesny design',
    description:
      'Projektujemy estetyczne i czytelne strony dopasowane do Twojej branży, które budują zaufanie i profesjonalny wizerunek marki.',
  },
  {
    icon: '⚡',
    title: 'Szybka realizacja',
    description:
      'Większość projektów realizujemy w 7–14 dni. Działamy sprawnie, bez przeciągania terminów i zbędnych formalności.',
  },
  {
    icon: '📱',
    title: 'Pełna responsywność',
    description:
      'Twoja strona będzie perfekcyjnie działać na telefonach, tabletach i komputerach — to dziś absolutny standard.',
  },
  {
    icon: '🎯',
    title: 'Prosta obsługa',
    description:
      'Tworzymy strony, które są łatwe w dalszym użytkowaniu i rozbudowie. Bez technicznego chaosu i zbędnych komplikacji.',
  },
];


export const offers = [
  {
    id: 'wizytowka',
    title: 'Strona wizytówka',
    price: 'od 800 zł',
    description:
      'Idealne rozwiązanie dla małych firm i osób rozpoczynających działalność. Jednostronicowa strona zawierająca opis oferty, dane kontaktowe oraz podstawowe informacje o firmie. Szybka, estetyczna i gotowa do działania.',
  },
  {
    id: 'firmowa',
    title: 'Strona firmowa',
    price: 'od 1500 zł',
    description:
      'Rozbudowana strona internetowa z podstronami, prezentacją usług, realizacjami oraz formularzem kontaktowym. Świetnie sprawdzi się jako główna wizytówka firmy w internecie.',
  },
  {
    id: 'landing',
    title: 'Landing page',
    price: 'od 1000 zł',
    description:
      'Strona nastawiona na sprzedaż lub pozyskiwanie zapytań. Idealna pod kampanie reklamowe, promocję usług lub produktów. Skupiona na konwersji i czytelnym przekazie.',
  },
];


export const steps: Step[] = [
  { number: 1, title: 'Kontakt', description: 'Rozmawiamy o Twoich potrzebach.' },
  { number: 2, title: 'Projekt', description: 'Przygotowujemy projekt graficzny.' },
  { number: 3, title: 'Wdrożenie', description: 'Kodujemy i testujemy stronę.' },
  { number: 4, title: 'Publikacja', description: 'Wrzucamy stronę online.' },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Strona firmowa',
    description: 'Nowoczesna strona dla firmy budowlanej.',
    category: 'Strona firmowa',
    gradient: 'from-blue-500 to-purple-600',
  },
];

export const faqs: FAQItem[] = [
  {
    question: 'Ile trwa realizacja?',
    answer: 'Zwykle od 7 do 14 dni.',
  },
  {
    question: 'Czy strona działa na telefonie?',
    answer: 'Tak, wszystkie strony są responsywne.',
  },
];
