import 'next-auth';

export type ThemeProps = {
  isDark: boolean;
};

export type ThemeToggleProps = ThemeProps & {
  setIsDark: (isDark: boolean) => void;
};

export type CopyToClipboardProps = {
  text: string;
  type: string;
};

export type PakietType = 'wizytowka' | 'firmowa' | 'landing';
export type UslugaDodatkowaType = 'podstrona' | 'blog' | 'sklep' | 'rezerwacje' | 'wielojezyczny' | 'zaawansowaneSEO' | 'integracjaAPI' | 'animacje' | 'hosting' | 'utrzymanie';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
