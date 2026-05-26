import { Redirect, useSegments } from 'expo-router';
import React from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/providers/AuthProvider';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();
  const segments = useSegments();

  if (isLoading) return <LoadingScreen />;

  const inAuthGroup = segments[0] === '(auth)';
  const inAppRoute = segments[0] === '(tabs)'
    || segments[0] === 'tracks'
    || segments[0] === 'courses'
    || segments[0] === 'lessons';

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (isAuthenticated && needsOnboarding && !(segments as string[]).includes('career-goal')) {
    return <Redirect href="/(auth)/career-goal" />;
  }

  if (isAuthenticated && !needsOnboarding && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
