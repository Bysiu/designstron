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
    wizytowka: {
      nazwa: "Strona wizytówka",
      bazowaCena: 800,
      opis: "Idealne rozwiązanie dla małych firm i osób rozpoczynających działalność",
      zawiera: {
        podstrony: 1,
        formularzKontaktowy: true,
        integracjaMap: true,
        podstawoweSEO: true,
        panelAdmin: true,
        wsparcieDni: 30
      }
    },
    firmowa: {
      nazwa: "Strona firmowa",
      bazowaCena: 1500,
      opis: "Rozbudowana strona z podstronami, prezentacją usług i realizacji",
      zawiera: {
        podstrony: 10,
        portfolio: true,
        blog: true,
        zaawansowaneSEO: true,
        integracjeSocial: true,
        panelCMS: true,
        wsparcieDni: 60,
        szkolenie: true
      }
    },
    landing: {
      nazwa: "Landing page",
      bazowaCena: 1000,
      opis: "Strona nastawiona na sprzedaż lub pozyskiwanie zapytań",
      zawiera: {
        optymalizacjaKonwersji: true,
        abTesting: true,
        integracjaAds: true,
        analytics: true,
        przyciskiCTA: true,
        formularzeLeadowe: true,
        wsparcieDni: 45
      }
    }
  },

  // Dodatkowe usługi i ich ceny
  uslugiDodatkowe: {
    podstrona: {
      nazwa: "Dodatkowa podstrona",
      cena: 150,
      opis: "Każda kolejna podstrona powyżej limitu pakietu"
    },
    blog: {
      nazwa: "Blog z systemem CMS",
      cena: 500,
      opis: "Pełny system zarządzania blogiem"
    },
    sklep: {
      nazwa: "Sklep internetowy",
      cena: 2000,
      opis: "Podstawowy sklep z płatnościami online"
    },
    rezerwacje: {
      nazwa: "System rezerwacji",
      cena: 800,
      opis: "Kalendarz rezerwacji z powiadomieniami"
    },
    wielojezyczny: {
      nazwa: "Wersja wielojęzyczna",
      cena: 1000,
      opis: "Wsparcie dla wielu języków"
    },
    zaawansowaneSEO: {
      nazwa: "Zaawansowane SEO",
      cena: 800,
      opis: "Pełna optymalizacja SEO z audytem"
    },
    integracjaAPI: {
      nazwa: "Integracja API",
      cena: 1200,
      opis: "Integracja z zewnętrznymi systemami"
    },
    animacje: {
      nazwa: "Zaawansowane animacje",
      cena: 600,
      opis: "Custom animacje i interakcje"
    },
    hosting: {
      nazwa: "Hosting i domena (rok)",
      cena: 400,
      opis: "Konfiguracja hostingu i rejestracja domeny"
    },
    utrzymanie: {
      nazwa: "Utrzymanie (miesiąc)",
      cena: 200,
      opis: "Regularne aktualizacje i wsparcie"
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
