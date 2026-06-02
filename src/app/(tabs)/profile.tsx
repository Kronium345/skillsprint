import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';
import { useNotifications } from '@/providers/NotificationProvider';
import { Midnight } from '@/theme/midnight';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    permissionStatus,
    requestPermission,
    scheduleDailyReminder,
    scheduleResumeReminder,
    cancelAllReminders,
  } = useNotifications();
  const [lastCourseTitle, setLastCourseTitle] = useState<string | null>(null);
  const [lastCourseId, setLastCourseId] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  useEffect(() => {
    AsyncStorage.multiGet(['lastCourseTitle', 'lastCourseId'])
      .then(([titleEntry, idEntry]) => {
        setLastCourseTitle(titleEntry[1]);
        setLastCourseId(idEntry[1]);
      })
      .catch(() => {
        setLastCourseTitle(null);
        setLastCourseId(null);
      });
  }, []);

  const ensurePermission = async () => {
    if (permissionStatus === 'granted') return true;
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert('Notifications disabled', 'Enable notifications in device settings to use reminders.');
    }
    return granted;
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

        <GlassCard style={tw`gap-3`}>
          <View style={tw`flex-row items-center justify-between`}>
            <AppText variant="label">Learning reminders</AppText>
            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons
                name={permissionStatus === 'granted' ? 'notifications' : 'notifications-off'}
                size={16}
                color={permissionStatus === 'granted' ? Midnight.accent : Midnight.textSecondary}
              />
              <AppText variant="caption">
                {permissionStatus === 'granted' ? 'Enabled' : 'Disabled'}
              </AppText>
            </View>
          </View>

          <Pressable
            onPress={async () => {
              if (!(await ensurePermission())) return;
              await scheduleDailyReminder(19, 0);
              Alert.alert('Reminder scheduled', 'Daily reminder set for 7:00 PM.');
            }}
            style={({ pressed }) => [
              tw`rounded-card border border-border px-3 py-2`,
              { backgroundColor: Midnight.elevated, opacity: pressed ? 0.9 : 1 },
            ]}>
            <AppText variant="caption" style={tw`text-foreground`}>
              Set daily reminder (7:00 PM)
            </AppText>
          </Pressable>

          <Pressable
            onPress={async () => {
              if (!(await ensurePermission())) return;
              const title = lastCourseTitle ?? 'your course';
              await scheduleResumeReminder(title, lastCourseId);
              Alert.alert('Reminder scheduled', `We will remind you to continue "${title}" tomorrow.`);
            }}
            style={({ pressed }) => [
              tw`rounded-card border border-border px-3 py-2`,
              { backgroundColor: Midnight.elevated, opacity: pressed ? 0.9 : 1 },
            ]}>
            <AppText variant="caption" style={tw`text-foreground`}>
              Remind me to continue {lastCourseTitle ? `"${lastCourseTitle}"` : 'my latest course'}
            </AppText>
          </Pressable>

          <Pressable
            onPress={async () => {
              await cancelAllReminders();
              Alert.alert('Done', 'All scheduled reminders were cleared.');
            }}
            style={({ pressed }) => [
              tw`rounded-card border border-border px-3 py-2`,
              { backgroundColor: Midnight.elevated, opacity: pressed ? 0.9 : 1 },
            ]}>
            <AppText variant="caption" style={tw`text-warning`}>
              Clear all reminders
            </AppText>
          </Pressable>
        </GlassCard>
      </View>

      <GradientButton label="Sign out" variant="outline" onPress={handleLogout} />
    </Screen>
  );
}
