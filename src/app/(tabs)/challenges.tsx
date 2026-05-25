import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Screen } from '@/components/ui/Screen';
import tw from '@/lib/twrnc';

export default function ChallengesScreen() {
  return (
    <Screen>
      <AppText variant="title">Challenges</AppText>
      <GlassCard style={tw`mt-5 gap-2`}>
        <AppText variant="label">Daily quiz</AppText>
        <AppText variant="caption">
          Leaderboards and weekly challenges will connect to your MERN API.
        </AppText>
      </GlassCard>
    </Screen>
  );
}
