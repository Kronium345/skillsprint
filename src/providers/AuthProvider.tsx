import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '@/lib/api';
import { AUTH_KEYS } from '@/lib/auth-keys';
import type { CareerGoal, ExperienceLevel, UserProfile } from '@/types/lms';

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  login: (token: string, profile?: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<UserProfile>) => Promise<void>;
  setCareerProfile: (careerGoal: CareerGoal, experienceLevel: ExperienceLevel) => Promise<void>;
  /** Dev-only: skip API and enter the app */
  devSkipAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistProfile(profile: Partial<UserProfile>) {
  if (profile.email) await AsyncStorage.setItem('email', profile.email);
  if (profile.username) await AsyncStorage.setItem('username', profile.username);
  if (profile.careerGoal) await AsyncStorage.setItem('careerGoal', profile.careerGoal);
  if (profile.experienceLevel) {
    await AsyncStorage.setItem('experienceLevel', profile.experienceLevel);
  }
  if (profile.subscriptionPlan) {
    await AsyncStorage.setItem('subscriptionPlan', profile.subscriptionPlan);
  }
}

async function loadStoredProfile(): Promise<UserProfile | null> {
  const entries = await AsyncStorage.multiGet([
    'email',
    'username',
    'careerGoal',
    'experienceLevel',
    'subscriptionPlan',
  ]);
  const map = Object.fromEntries(entries);
  const profile: UserProfile = {
    email: map.email ?? undefined,
    username: map.username ?? undefined,
    careerGoal: (map.careerGoal as CareerGoal) ?? undefined,
    experienceLevel: (map.experienceLevel as ExperienceLevel) ?? undefined,
    subscriptionPlan: map.subscriptionPlan ?? undefined,
  };
  if (!profile.email && !profile.username) return null;
  return profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const needsOnboarding = isAuthenticated && (!user?.careerGoal || !user?.experienceLevel);

  const bootstrap = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const { data } = await api.get<UserProfile>('/auth/get-profile');
        const stored = await loadStoredProfile();
        setUser({ ...stored, ...data });
        setIsAuthenticated(true);
      } catch {
        const stored = await loadStoredProfile();
        if (stored) {
          setUser(stored);
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (token: string, profile?: Partial<UserProfile>) => {
    await AsyncStorage.setItem('authToken', token);
    if (profile) await persistProfile(profile);
    const merged = { ...(await loadStoredProfile()), ...profile };
    setUser(merged);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([...AUTH_KEYS]);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback(async (partial: Partial<UserProfile>) => {
    await persistProfile(partial);
    setUser((prev) => ({ ...prev, ...partial }));
  }, []);

  const setCareerProfile = useCallback(
    async (careerGoal: CareerGoal, experienceLevel: ExperienceLevel) => {
      try {
        await api.post('/auth/update-career-profile', { careerGoal, experienceLevel });
      } catch {
        // Offline / server not running — still persist locally
      }
      await updateUser({ careerGoal, experienceLevel });
    },
    [updateUser],
  );

  const devSkipAuth = useCallback(async () => {
    await login('dev-token', {
      email: 'demo@skillsprint.app',
      username: 'Demo Learner',
      careerGoal: 'student',
      experienceLevel: 'beginner',
      xp: 120,
      streak: 3,
    });
  }, [login]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      needsOnboarding,
      login,
      logout,
      updateUser,
      setCareerProfile,
      devSkipAuth,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      needsOnboarding,
      login,
      logout,
      updateUser,
      setCareerProfile,
      devSkipAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
