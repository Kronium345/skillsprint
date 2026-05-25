import { create } from 'twrnc';

import { Midnight } from '@/theme/midnight';

/** Midnight AI — twrnc instance (no separate tailwind.config file) */
const tw = create({
  theme: {
    extend: {
      colors: {
        background: Midnight.background,
        surface: Midnight.surface,
        elevated: Midnight.elevated,
        primary: Midnight.primary,
        secondary: Midnight.secondary,
        accent: Midnight.accent,
        success: Midnight.success,
        warning: Midnight.warning,
        danger: Midnight.danger,
        foreground: {
          DEFAULT: Midnight.textPrimary,
          muted: Midnight.textSecondary,
        },
        border: Midnight.border,
        'border-glow': Midnight.borderGlow,
        xp: Midnight.gamification.xp,
        streak: Midnight.gamification.streak,
        'streak-muted': 'rgba(245, 158, 11, 0.2)',
        gold: Midnight.gamification.achievement,
        certificate: Midnight.gamification.certificate,
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
      },
      fontFamily: {
        display: ['SpaceGrotesk_700Bold', 'SpaceGrotesk_600SemiBold', 'system-ui'],
        body: ['Inter_400Regular', 'Inter_500Medium', 'system-ui'],
      },
    },
  },
});

export default tw;
