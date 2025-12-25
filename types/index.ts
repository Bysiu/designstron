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

export type PakietType = 'basic' | 'professional' | 'premium';
export type UslugaDodatkowaType =
  | 'podstrona'
  | 'blog'
  | 'gallery'
  | 'contact-form'
  | 'seo'
  | 'analytics'
  | 'social'
  | 'newsletter'
  | 'chat'
  | 'hosting'
  | 'domain'
  | 'ssl'
  | 'maintenance'
  | 'training'
  | 'copywriting';

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
