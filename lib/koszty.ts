import { PakietType as ImportedPakietType, UslugaDodatkowaType as ImportedUslugaDodatkowaType } from '@/types';

interface PakietConfig {
  nazwa: string;
  bazowaCena: number;
  opis: string;
  zawiera: Record<string, any>;
}

interface UslugaConfig {
  nazwa: string;
  cena: number;
  opis: string;
}

interface KosztyConfig {
  pakiety: Record<string, PakietConfig>;
  uslugiDodatkowe: Record<string, UslugaConfig>;
  obliczCene: (konfiguracja: {
    pakiet: string;
    uslugiDodatkowe?: string[];
    dodatkowePodstrony?: number;
  }) => {
    sumaCalkowita: number;
    szczegolyCeny: {
      pakiet: { nazwa: string; cena: number };
      dodatkowePodstrony: { ilosc: number; cenaJednostkowa: number; cenaCalkowita: number } | null;
      uslugiDodatkowe: { nazwa: string; cena: number }[];
    };
  };
}

export const KONFIGURACJA_KOSZTOW: KosztyConfig = {
  // Podstawowe pakiety
  pakiety: {
    basic: {
      nazwa: 'Strona Basic',
      bazowaCena: 1500,
      opis: 'Idealna dla małych firm i freelancerów',
      zawiera: {
        podstrony: 5,
        formularzKontaktowy: true,
        podstawoweSEO: true
      }
    },
    professional: {
      nazwa: 'Strona Professional',
      bazowaCena: 3000,
      opis: 'Dla rozwijających się biznesów',
      zawiera: {
        podstrony: 10,
        panelCMS: true,
        blog: true,
        galeria: true,
        integracjeSocial: true
      }
    },
    premium: {
      nazwa: 'Strona Premium',
      bazowaCena: 5000,
      opis: 'Zaawansowane rozwiązania dla dużych firm',
      zawiera: {
        podstrony: 999,
        zaawansowanyCMS: true,
        sklepInternetowy: true,
        systemRezerwacji: true,
        aplikacjeWebowe: true
      }
    }
  },

  // Dodatkowe usługi i ich ceny
  uslugiDodatkowe: {
    podstrona: {
      nazwa: 'Dodatkowa podstrona',
      cena: 200,
      opis: 'Dodatkowe podstrony powyżej limitu pakietu'
    },
    blog: {
      nazwa: 'Blog',
      cena: 500,
      opis: 'Dodatkowa funkcja'
    },
    gallery: {
      nazwa: 'Galeria zdjęć',
      cena: 300,
      opis: 'Dodatkowa funkcja'
    },
    'contact-form': {
      nazwa: 'Zaawansowany formularz kontaktowy',
      cena: 200,
      opis: 'Dodatkowa funkcja'
    },
    seo: {
      nazwa: 'Zaawansowana optymalizacja SEO',
      cena: 800,
      opis: 'Dodatkowa funkcja'
    },
    analytics: {
      nazwa: 'Integracja z Google Analytics',
      cena: 150,
      opis: 'Dodatkowa funkcja'
    },
    social: {
      nazwa: 'Integracja z mediami społecznościowymi',
      cena: 250,
      opis: 'Dodatkowa funkcja'
    },
    newsletter: {
      nazwa: 'System newsletter',
      cena: 400,
      opis: 'Dodatkowa funkcja'
    },
    chat: {
      nazwa: 'Live chat na stronie',
      cena: 350,
      opis: 'Dodatkowa funkcja'
    },
    hosting: {
      nazwa: 'Hosting na pierwszy rok',
      cena: 300,
      opis: 'Dodatkowa usługa'
    },
    domain: {
      nazwa: 'Rejestracja domeny',
      cena: 100,
      opis: 'Dodatkowa usługa'
    },
    ssl: {
      nazwa: 'Certyfikat SSL',
      cena: 150,
      opis: 'Dodatkowa usługa'
    },
    maintenance: {
      nazwa: 'Pakiet serwisowy (12 miesięcy)',
      cena: 1200,
      opis: 'Dodatkowa usługa'
    },
    training: {
      nazwa: 'Szkolenie z obsługi panelu',
      cena: 400,
      opis: 'Dodatkowa usługa'
    },
    copywriting: {
      nazwa: 'Tresowanie tekstów',
      cena: 800,
      opis: 'Dodatkowa usługa'
    }
  },

  // Obliczanie ceny na podstawie konfiguracji
  obliczCene: (konfiguracja: {
    pakiet: keyof typeof KONFIGURACJA_KOSZTOW.pakiety;
    uslugiDodatkowe?: string[];
    dodatkowePodstrony?: number;
  }) => {
    const pakiet = KONFIGURACJA_KOSZTOW.pakiety[konfiguracja.pakiet];
    let sumaCalkowita = pakiet.bazowaCena;

    // Dodatkowe podstrony
    if (konfiguracja.dodatkowePodstrony && konfiguracja.dodatkowePodstrony > 0) {
      sumaCalkowita += konfiguracja.dodatkowePodstrony * KONFIGURACJA_KOSZTOW.uslugiDodatkowe.podstrona.cena;
    }

    // Dodatkowe usługi
    if (konfiguracja.uslugiDodatkowe) {
      konfiguracja.uslugiDodatkowe.forEach(usluga => {
        const uslugaConfig = KONFIGURACJA_KOSZTOW.uslugiDodatkowe[usluga as keyof typeof KONFIGURACJA_KOSZTOW.uslugiDodatkowe];
        if (uslugaConfig) {
          sumaCalkowita += uslugaConfig.cena;
        }
      });
    }

    return {
      sumaCalkowita,
      szczegolyCeny: {
        pakiet: { nazwa: pakiet.nazwa, cena: pakiet.bazowaCena },
        dodatkowePodstrony: konfiguracja.dodatkowePodstrony ? {
          ilosc: konfiguracja.dodatkowePodstrony,
          cenaJednostkowa: KONFIGURACJA_KOSZTOW.uslugiDodatkowe.podstrona.cena,
          cenaCalkowita: konfiguracja.dodatkowePodstrony * KONFIGURACJA_KOSZTOW.uslugiDodatkowe.podstrona.cena
        } : null,
        uslugiDodatkowe: (konfiguracja.uslugiDodatkowe?.map(usluga => {
          const uslugaConfig = KONFIGURACJA_KOSZTOW.uslugiDodatkowe[usluga as keyof typeof KONFIGURACJA_KOSZTOW.uslugiDodatkowe];
          return uslugaConfig ? {
            nazwa: uslugaConfig.nazwa,
            cena: uslugaConfig.cena
          } : null;
        }).filter((item): item is { nazwa: string; cena: number } => item !== null)) ?? []
      }
    };
  }
};

export type PakietType = keyof typeof KONFIGURACJA_KOSZTOW.pakiety;
export type UslugaDodatkowaType = keyof typeof KONFIGURACJA_KOSZTOW.uslugiDodatkowe;

// Re-export types for compatibility
export type { ImportedPakietType, ImportedUslugaDodatkowaType };