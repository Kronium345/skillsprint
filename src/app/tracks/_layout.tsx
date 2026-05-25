import { Stack } from 'expo-router';

import { Midnight } from '@/theme/midnight';

export default function TracksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Midnight.surface },
        headerTintColor: Midnight.textPrimary,
        headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
        contentStyle: { backgroundColor: Midnight.background },
      }}>
      <Stack.Screen name="index" options={{ title: 'All Tracks' }} />
      <Stack.Screen name="[slug]/courses" options={{ title: 'Courses' }} />
      <Stack.Screen name="[slug]/quiz-topics" options={{ title: 'Quiz topics' }} />
    </Stack>
  );
}
