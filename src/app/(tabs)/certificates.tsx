import React from 'react';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Screen } from '@/components/ui/Screen';
import tw from '@/lib/twrnc';

export default function CertificatesScreen() {
  return (
    <Screen>
      <AppText variant="title">Certificates</AppText>
      <GlassCard style={tw`mt-5`}>
        <AppText variant="caption" style={tw`text-certificate`}>
          Complete track quizzes to earn certificates. Premium unlocks verified
          credentials.
        </AppText>
      </GlassCard>
    </Screen>
  );
}
