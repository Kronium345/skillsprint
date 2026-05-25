import { Platform } from 'react-native';

import { Midnight } from '@/theme/midnight';

/** Dark-first Midnight AI — maps to legacy ThemedView / useTheme hooks */
export const Colors = {
  dark: {
    text: Midnight.textPrimary,
    background: Midnight.background,
    backgroundElement: Midnight.surface,
    backgroundSelected: Midnight.elevated,
    textSecondary: Midnight.textSecondary,
  },
  light: {
    text: Midnight.light.textPrimary,
    background: Midnight.light.background,
    backgroundElement: Midnight.light.surface,
    backgroundSelected: '#E2E8F0',
    textSecondary: Midnight.light.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  mono: Platform.select({
    ios: 'ui-monospace',
    default: 'monospace',
    web: 'var(--font-mono)',
  }) as string,
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
