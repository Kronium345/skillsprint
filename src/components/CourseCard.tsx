import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { CourseSummary } from '@/types/content';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

type Props = {
  course: CourseSummary;
};

export function CourseCard({ course }: Props) {
  return (
    <Link href={`/courses/${course._id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          tw`rounded-card-lg border border-border p-4 gap-2`,
          { backgroundColor: Midnight.surface },
          pressed && tw`border-primary opacity-90`,
        ]}>
        <AppText variant="label">{course.title}</AppText>
        <AppText variant="caption" numberOfLines={2}>
          {course.description}
        </AppText>
        <View style={tw`flex-row gap-3 mt-1`}>
          <AppText variant="caption" style={tw`text-accent`}>
            {course.difficulty}
          </AppText>
          <AppText variant="caption">{course.durationMinutes} min</AppText>
        </View>
      </Pressable>
    </Link>
  );
}
