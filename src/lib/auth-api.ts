import type { UserProfile } from '@/types/lms';

export type AuthResponse = {
  token: string;
  user?: Record<string, unknown>;
};

export function mapAuthUser(
  user: AuthResponse['user'],
  fallbackEmail: string,
): Partial<UserProfile> {
  return {
    email: (user?.email as string) ?? fallbackEmail,
    username: (user?.username as string) ?? fallbackEmail.split('@')[0],
    careerGoal: user?.careerGoal as UserProfile['careerGoal'],
    experienceLevel: user?.experienceLevel as UserProfile['experienceLevel'],
    xp: typeof user?.xpTotal === 'number' ? user.xpTotal : undefined,
    streak: typeof user?.streakCount === 'number' ? user.streakCount : undefined,
  };
}
