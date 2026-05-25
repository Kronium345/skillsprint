import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';
import { Midnight } from '@/theme/midnight';
import type { CareerGoal, ExperienceLevel } from '@/types/lms';

const GOALS: { id: CareerGoal; label: string; description: string }[] = [
  { id: 'student', label: 'Student', description: 'Internships and first roles' },
  { id: 'career-switcher', label: 'Career switcher', description: 'Move into tech or AI' },
  { id: 'professional', label: 'Professional', description: 'Level up with AI productivity' },
  { id: 'entrepreneur', label: 'Entrepreneur', description: 'Automate and grow with AI' },
];

const LEVELS: { id: ExperienceLevel; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function CareerGoalScreen() {
  const router = useRouter();
  const { setCareerProfile } = useAuth();
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [level, setLevel] = useState<ExperienceLevel | null>(null);

  const finish = async () => {
    if (!goal || !level) return;
    await setCareerProfile(goal, level);
    router.replace('/(tabs)');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={tw`px-6 pt-4 pb-10 gap-4`}
        showsVerticalScrollIndicator={false}>
        <AppText variant="title">Your learning path</AppText>
        <AppText variant="caption">
          We&apos;ll tailor tracks and daily challenges to your goals.
        </AppText>

        <AppText variant="label" style={tw`mt-2`}>
          I am a…
        </AppText>
        <View style={tw`gap-2`}>
          {GOALS.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => setGoal(g.id)}
              style={[
                tw`rounded-card-lg border p-4 gap-1`,
                { backgroundColor: Midnight.surface },
                goal === g.id ? tw`border-primary` : tw`border-border`,
              ]}>
              <AppText variant="label">{g.label}</AppText>
              <AppText variant="caption">{g.description}</AppText>
            </Pressable>
          ))}
        </View>

        <AppText variant="label" style={tw`mt-2`}>
          Skill level
        </AppText>
        <View style={tw`flex-row flex-wrap gap-2`}>
          {LEVELS.map((l) => (
            <Pressable
              key={l.id}
              onPress={() => setLevel(l.id)}
              style={[
                tw`rounded-full border px-4 py-2`,
                { backgroundColor: Midnight.surface },
                level === l.id ? tw`border-primary` : tw`border-border`,
              ]}>
              <AppText variant="caption">{l.label}</AppText>
            </Pressable>
          ))}
        </View>

        <GradientButton
          label="Start learning"
          onPress={finish}
          disabled={!goal || !level}
          style={tw`mt-4`}
        />
      </ScrollView>
    </Screen>
  );
}
