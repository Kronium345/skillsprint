import { DarkTheme, type Theme } from '@react-navigation/native';

import { Midnight } from '@/theme/midnight';

export const MidnightNavigationTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Midnight.primary,
    background: Midnight.background,
    card: Midnight.surface,
    text: Midnight.textPrimary,
    border: Midnight.border,
    notification: Midnight.accent,
  },
};
