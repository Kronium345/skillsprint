import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <Screen style={tw`justify-between pb-8`}>
      <View style={tw`gap-5 pt-2`}>
        <AppText variant="title">Profile</AppText>
        <GlassCard style={tw`gap-2`}>
          <AppText variant="subtitle" style={tw`text-lg`}>
            {user?.username ?? 'Learner'}
          </AppText>
          <AppText variant="caption">{user?.email}</AppText>
          <AppText variant="caption">
            Goal: {user?.careerGoal ?? '—'} · Level: {user?.experienceLevel ?? '—'}
          </AppText>
          <View style={tw`flex-row gap-4 mt-1`}>
            <AppText variant="label" style={tw`text-xp`}>
              {user?.xp ?? 0} XP
            </AppText>
            <AppText variant="label" style={tw`text-streak`}>
              {user?.streak ?? 0} day streak
            </AppText>
          </View>
        </GlassCard>
      </View>

      <GradientButton label="Sign out" variant="outline" onPress={handleLogout} />
    </Screen>
  );
}
