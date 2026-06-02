import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AuthGate } from '@/components/AuthGate';
import { AuthProvider } from '@/providers/AuthProvider';
import { FontProvider } from '@/providers/FontProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { MidnightNavigationTheme } from '@/theme/navigation';

export default function RootLayout() {
  return (
    <FontProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider value={MidnightNavigationTheme}>
              <StatusBar style="light" />
              <AuthGate>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="tracks" />
                  <Stack.Screen name="courses" />
                  <Stack.Screen name="lessons" />
                </Stack>
              </AuthGate>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </FontProvider>
  );
}
