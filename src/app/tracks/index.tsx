import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { TrackCard } from '@/components/TrackCard';
import { TRACKS } from '@/constants/tracks';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

export default function TrackListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'All Tracks' }} />
      <ScrollView
        style={{ backgroundColor: Midnight.background }}
        contentContainerStyle={tw`p-6 gap-3 pb-10`}>
        {TRACKS.map((track) => (
          <TrackCard
            key={track.slug}
            track={track}
            href={`/tracks/${track.slug}/quiz-topics`}
          />
        ))}
      </ScrollView>
    </>
  );
}
