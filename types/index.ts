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
