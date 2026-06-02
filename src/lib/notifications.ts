import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const DEFAULT_CHANNEL_ID = 'learning-reminders';
let cachedNotifications: typeof import('expo-notifications') | null | undefined;

async function getNotificationsModule() {
  if (cachedNotifications !== undefined) return cachedNotifications;
  try {
    cachedNotifications = await import('expo-notifications');
  } catch {
    cachedNotifications = null;
  }
  return cachedNotifications;
}

export async function initializeNotificationsAsync() {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  return true;
}

export async function configureNotificationChannelAsync() {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Learning reminders',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4F8CFF',
  });
}

export async function registerForPushNotificationsAsync() {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return null;
  await configureNotificationChannelAsync();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (!Device.isDevice) {
    // Expo push tokens require a physical device.
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) return null;
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

export async function scheduleDailyLearningReminderAsync(hour = 19, minute = 0) {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'SkillSprint reminder',
      body: 'Keep your streak alive. Continue a lesson tonight.',
      data: { type: 'daily-learning-reminder', path: '/(tabs)/courses' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleResumeCourseReminderAsync(
  courseTitle: string,
  courseId?: string | null,
) {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return null;
  const path = courseId ? `/courses/${courseId}` : '/(tabs)/courses';
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Continue your course',
      body: `Pick up where you left off in "${courseTitle}".`,
      data: { type: 'resume-course', courseTitle, courseId, path },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24,
    },
  });
}

export async function cancelAllRemindersAsync() {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
