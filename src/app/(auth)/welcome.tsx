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
    <Screen edges={['top', 'bottom']} style={tw`justify-center pb-6`}>
      <View style={tw`gap-10`}>
        <View style={tw`gap-3`}>
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
          <Link href="/(auth)/signup" asChild>
            <GradientButton label="Create account" />
          </Link>
          <Link href="/(auth)/login" asChild>
            <GradientButton label="Sign in" variant="outline" />
          </Link>
          {__DEV__ && (
            <GradientButton
              label="Try demo (dev only)"
              variant="outline"
              onPress={() => devSkipAuth()}
            />
          )}
        </View>
      </View>
    </Screen>
  );
}
