import { Stack } from 'expo-router';

import { Midnight } from '@/theme/midnight';

export default function LessonsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Midnight.surface },
        headerTintColor: Midnight.textPrimary,
        headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
        contentStyle: { backgroundColor: Midnight.background },
      }}
    />
  );
}
