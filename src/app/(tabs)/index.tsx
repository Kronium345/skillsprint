import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { TrackCard } from '@/components/TrackCard';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Screen } from '@/components/ui/Screen';
import { BRAND } from '@/constants/brand';
import { TRACKS } from '@/constants/tracks';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';
export default function HomeScreen() {
  const { user } = useAuth();
  const featured = TRACKS.slice(0, 3);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={tw`px-6 pb-8 gap-5`}
        showsVerticalScrollIndicator={false}>
        <View style={tw`gap-1 pt-2`}>
          <AppText variant="caption">Welcome back</AppText>
          <AppText variant="title">{user?.username ?? 'Learner'}</AppText>
        </View>

        <GlassCard style={tw`gap-2 border-border-glow`}>
          <View style={tw`flex-row justify-between items-center`}>
            <AppText variant="label">Daily streak</AppText>
            <View style={tw`rounded-full bg-streak-muted px-2 py-0.5`}>
              <AppText variant="caption" style={tw`text-streak`}>
                🔥 {user?.streak ?? 0}
              </AppText>
            </View>
          </View>
          <AppText variant="hero" style={tw`text-xp`}>
            {user?.xp ?? 0}
          </AppText>
          <AppText variant="caption">XP earned — keep your sprint alive</AppText>
        </GlassCard>

        <View style={tw`flex-row justify-between items-center`}>
          <AppText variant="subtitle" style={tw`text-lg`}>
            Continue learning
          </AppText>
          <Link href="/tracks" asChild>
            <Pressable>
              <AppText variant="link">All tracks</AppText>
            </Pressable>
          </Link>
        </View>

        <View style={tw`gap-3`}>
          {featured.map((track) => (
            <TrackCard
              key={track.slug}
              track={track}
              href={`/tracks/${track.slug}/courses`}
            />
          ))}
        </View>

        <AppText variant="caption" style={tw`text-center mt-2`}>
          {BRAND.academyName}
        </AppText>
      </ScrollView>
    </Screen>
  );
}
