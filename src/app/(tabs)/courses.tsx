import React from 'react';
import { ScrollView, View } from 'react-native';

import { TrackCard } from '@/components/TrackCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { TRACKS } from '@/constants/tracks';
import tw from '@/lib/twrnc';

export default function CoursesScreen() {
  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={tw`px-6 pb-8 gap-4`}
        showsVerticalScrollIndicator={false}>
        <View style={tw`gap-1 pt-2`}>
          <AppText variant="title">Browse courses</AppText>
          <AppText variant="caption">
            Seven career tracks — from Generative AI to productivity.
          </AppText>
        </View>
        <View style={tw`gap-3`}>
          {TRACKS.map((track) => (
            <TrackCard
              key={track.slug}
              track={track}
              href={`/tracks/${track.slug}/courses`}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
