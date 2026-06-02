import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import {
  cancelAllRemindersAsync,
  initializeNotificationsAsync,
  registerForPushNotificationsAsync,
  scheduleDailyLearningReminderAsync,
  scheduleResumeCourseReminderAsync,
} from '@/lib/notifications';

type NotificationContextValue = {
  expoPushToken: string | null;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  requestPermission: () => Promise<boolean>;
  scheduleDailyReminder: (hour?: number, minute?: number) => Promise<void>;
  scheduleResumeReminder: (courseTitle: string, courseId?: string | null) => Promise<void>;
  cancelAllReminders: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>(
    'undetermined',
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const notificationsReady = await initializeNotificationsAsync();
      if (!notificationsReady) {
        if (mounted) setPermissionStatus('denied');
        return;
      }
      const token = await registerForPushNotificationsAsync();
      if (!mounted) return;
      setExpoPushToken(token);
      setPermissionStatus(token ? 'granted' : 'denied');
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let received: { remove: () => void } | null = null;
    let response: { remove: () => void } | null = null;

    (async () => {
      const Notifications = await import('expo-notifications').catch(() => null);
      if (!active || !Notifications) return;
      received = Notifications.addNotificationReceivedListener(() => {
        // Reserved for in-app notification UX.
      });
      response = Notifications.addNotificationResponseReceivedListener((event) => {
        const data = event.notification.request.content.data as
          | { path?: string; type?: string }
          | undefined;
        const path = data?.path;
        if (!path) return;
        Linking.openURL(`skillsprint://${path}`).catch(() => {
          // Non-blocking: user still sees notification content even if deep link fails.
        });
      });
    })();

    return () => {
      active = false;
      received?.remove();
      response?.remove();
    };
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      expoPushToken,
      permissionStatus,
      requestPermission: async () => {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
        setPermissionStatus(token ? 'granted' : 'denied');
        return !!token;
      },
      scheduleDailyReminder: async (hour = 19, minute = 0) => {
        await scheduleDailyLearningReminderAsync(hour, minute);
      },
      scheduleResumeReminder: async (courseTitle: string, courseId?: string | null) => {
        await scheduleResumeCourseReminderAsync(courseTitle, courseId);
      },
      cancelAllReminders: async () => {
        await cancelAllRemindersAsync();
      },
    }),
    [expoPushToken, permissionStatus],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
