import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { BRAND } from '@/constants/brand';
import api from '@/lib/api';
import { mapAuthUser, type AuthResponse } from '@/lib/auth-api';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';
import { Midnight } from '@/theme/midnight';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Check confirm password and try again.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/signup', {
        email: trimmedEmail,
        password,
        username: username.trim() || trimmedEmail.split('@')[0],
      });
      await login(data.token, mapAuthUser(data.user, trimmedEmail));
      router.replace('/(auth)/career-goal');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })
        ?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;

      if (status === 409) {
        Alert.alert('Account exists', 'This email is already registered. Sign in instead.', [
          { text: 'Sign in', onPress: () => router.replace('/(auth)/login') },
          { text: 'OK' },
        ]);
        return;
      }

      Alert.alert(
        'Sign up failed',
        message ?? 'Could not create your account. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={tw`gap-5`}>
      <View style={tw`gap-1`}>
        <AppText variant="title">Create your account</AppText>
        <AppText variant="caption">Join {BRAND.appName} and save your progress.</AppText>
      </View>

      <View style={tw`gap-3`}>
        <TextInput
          style={tw`rounded-card-lg border border-border bg-surface px-4 py-3.5 text-foreground font-body text-base`}
          placeholder="Display name (optional)"
          placeholderTextColor={Midnight.textSecondary}
          autoCapitalize="words"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`rounded-card-lg border border-border bg-surface px-4 py-3.5 text-foreground font-body text-base`}
          placeholder="Email"
          placeholderTextColor={Midnight.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`rounded-card-lg border border-border bg-surface px-4 py-3.5 text-foreground font-body text-base`}
          placeholder="Password (min. 8 characters)"
          placeholderTextColor={Midnight.textSecondary}
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={tw`rounded-card-lg border border-border bg-surface px-4 py-3.5 text-foreground font-body text-base`}
          placeholder="Confirm password"
          placeholderTextColor={Midnight.textSecondary}
          secureTextEntry
          autoComplete="new-password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <GradientButton label="Create account" onPress={handleSignup} loading={loading} />

      <View style={tw`flex-row justify-center gap-1`}>
        <AppText variant="caption">Already have an account?</AppText>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <AppText variant="link">Sign in</AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
