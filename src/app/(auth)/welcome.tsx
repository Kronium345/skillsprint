import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { BRAND } from '@/constants/brand';
import { useAuth } from '@/providers/AuthProvider';
import tw from '@/lib/twrnc';

export default function WelcomeScreen() {
  const { devSkipAuth } = useAuth();

  return (
    <Screen style={tw`justify-between pb-8`}>
      <View style={tw`flex-1 justify-center gap-3 mt-12`}>
        <View
          style={tw`self-start rounded-full border border-border-glow px-3 py-1 mb-2`}>
          <AppText variant="caption" style={tw`text-accent`}>
            AI Career Skills Academy
          </AppText>
        </View>
        <AppText variant="hero">{BRAND.appName}</AppText>
        <AppText variant="body" muted style={tw`text-lg leading-7`}>
          {BRAND.tagline}
        </AppText>
      </View>

      <View style={tw`gap-3`}>
        <Link href="/(auth)/login" asChild>
          <GradientButton label="Sign in" />
        </Link>
        <GradientButton
          label="Continue as demo learner"
          variant="outline"
          onPress={() => devSkipAuth()}
        />
      </View>
    </Screen>
  );
}
