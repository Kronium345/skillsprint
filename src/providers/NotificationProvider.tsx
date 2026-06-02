import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';

import {
  cancelAllRemindersAsync,
  registerForPushNotificationsAsync,
  scheduleDailyLearningReminderAsync,
  scheduleResumeCourseReminderAsync,
} from '@/lib/notifications';

type NotificationContextValue = {
  expoPushToken: string | null;
  permissionStatus: Notifications.PermissionStatus | 'undetermined';
  requestPermission: () => Promise<boolean>;
  scheduleDailyReminder: (hour?: number, minute?: number) => Promise<void>;
  scheduleResumeReminder: (courseTitle: string, courseId?: string | null) => Promise<void>;
  cancelAllReminders: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    Notifications.PermissionStatus | 'undetermined'
  >('undetermined');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      const perms = await Notifications.getPermissionsAsync();
      if (!mounted) return;
      setExpoPushToken(token);
      setPermissionStatus(perms.status);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener(() => {
      // Reserved for in-app notification UX.
    });
    const response = Notifications.addNotificationResponseReceivedListener((event) => {
      const data = event.notification.request.content.data as
        | { path?: string; type?: string }
        | undefined;
      const path = data?.path;
      if (!path) return;
      Linking.openURL(`skillsprint://${path}`).catch(() => {
        // Non-blocking: user still sees notification content even if deep link fails.
      });
    });
    return () => {
      received.remove();
      response.remove();
    };
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      expoPushToken,
      permissionStatus,
      requestPermission: async () => {
        const token = await registerForPushNotificationsAsync();
        const perms = await Notifications.getPermissionsAsync();
        setExpoPushToken(token);
        setPermissionStatus(perms.status);
        return perms.status === 'granted';
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
