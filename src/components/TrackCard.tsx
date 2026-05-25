import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { Track } from '@/constants/tracks';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

type Props = {
  track: Track;
  href?: `/tracks/${string}/courses` | `/tracks/${string}/quiz-topics`;
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sparkles: 'sparkles',
  'bar-chart': 'bar-chart',
  shield: 'shield-checkmark',
  'code-slash': 'code-slash',
  megaphone: 'megaphone',
  briefcase: 'briefcase',
  rocket: 'rocket',
};

export function TrackCard({ track, href = `/tracks/${track.slug}/courses` }: Props) {
  const iconName = iconMap[track.icon] ?? 'book';

  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          tw`flex-row items-center gap-3 rounded-card-lg border border-border p-4`,
          { backgroundColor: Midnight.surface },
          pressed && { borderColor: track.color + '66', opacity: 0.92 },
        ]}>
        <View
          style={[
            tw`h-12 w-12 rounded-xl items-center justify-center`,
            { backgroundColor: track.color + '22' },
          ]}>
          <Ionicons name={iconName} size={24} color={track.color} />
        </View>
        <View style={tw`flex-1 gap-1`}>
          <AppText variant="label">{track.title}</AppText>
          <AppText variant="caption" numberOfLines={2}>
            {track.subtitle}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Midnight.textSecondary} />
      </Pressable>
    </Link>
  );
}
