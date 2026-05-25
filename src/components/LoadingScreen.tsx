import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { BRAND } from '@/constants/brand';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

export function LoadingScreen() {
  return (
    <Screen safe={false}>
      <View style={tw`flex-1 items-center justify-center gap-3 px-6`}>
        <AppText variant="title">{BRAND.appName}</AppText>
        <AppText variant="caption" style={tw`text-center`}>
          {BRAND.tagline}
        </AppText>
        <ActivityIndicator size="large" color={Midnight.primary} style={tw`mt-6`} />
      </View>
    </Screen>
  );
}
