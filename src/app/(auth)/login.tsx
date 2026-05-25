import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { BRAND } from '@/constants/brand';
import api from '@/lib/api';
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
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string; user?: Record<string, unknown> }>(
        '/auth/login',
        { email: email.trim(), password },
      );
      await login(data.token, {
        email: email.trim(),
        username: (data.user?.username as string) ?? email.split('@')[0],
      });
      router.replace('/(auth)/career-goal');
    } catch {
      Alert.alert(
        'Sign in unavailable',
        'Backend not reachable yet. Use demo learner on the welcome screen.',
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
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`rounded-card-lg border border-border bg-surface px-4 py-3.5 text-foreground font-body text-base`}
          placeholder="Password"
          placeholderTextColor={Midnight.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <GradientButton label="Sign in" onPress={handleLogin} loading={loading} />
    </Screen>
  );
}
