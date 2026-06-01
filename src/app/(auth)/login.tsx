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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', {
        email: trimmedEmail,
        password,
      });
      await login(data.token, mapAuthUser(data.user, trimmedEmail));
      router.replace('/(auth)/career-goal');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      Alert.alert(
        'Sign in failed',
        message ?? 'Check your email and password, or create an account.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={tw`gap-6`}>
      <AppText variant="title">Sign in to {BRAND.appName}</AppText>

      <View style={tw`gap-4`}>
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
          placeholder="Password"
          placeholderTextColor={Midnight.textSecondary}
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <GradientButton label="Sign in" onPress={handleLogin} loading={loading} />

      <View style={tw`flex-row justify-center gap-1`}>
        <AppText variant="caption">New here?</AppText>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <AppText variant="link">Create account</AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}
