import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { CourseCard } from '@/components/CourseCard';
import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { getTrackBySlug } from '@/constants/tracks';
import api from '@/lib/api';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';
import type { CourseSummary } from '@/types/content';

export default function TrackCoursesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const track = getTrackBySlug(slug ?? '');

  const { data: courses, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['courses', slug],
    queryFn: async () => {
      const { data } = await api.get<CourseSummary[]>('/courses', {
        params: { trackSlug: slug },
      });
      return data;
    },
    enabled: !!slug,
  });

  if (!track) {
    return (
      <View style={[tw`flex-1 items-center justify-center gap-3`, { backgroundColor: Midnight.background }]}>
        <Ionicons name="alert-circle-outline" size={40} color={Midnight.warning} />
        <AppText variant="body">Track not found</AppText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: track.title }} />
      <ScrollView
        style={{ backgroundColor: Midnight.background }}
        contentContainerStyle={tw`p-6 gap-4 pb-10`}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={Midnight.primary}
            colors={[Midnight.primary]}
          />
        }>
        <AppText variant="caption">{track.subtitle}</AppText>

        {isLoading && (
          <ActivityIndicator color={Midnight.primary} style={tw`mt-6`} />
        )}

        {isError && (
          <View style={tw`items-center py-8 gap-3`}>
            <Ionicons name="cloud-offline-outline" size={40} color={Midnight.danger} />
            <AppText variant="body">Failed to load courses</AppText>
            <AppText variant="caption">Check your connection and try again.</AppText>
            <GradientButton label="Retry" variant="outline" onPress={() => refetch()} />
          </View>
        )}

        {!isLoading && !isError && courses?.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}

        {!isLoading && !isError && courses?.length === 0 && (
          <View style={tw`items-center py-8 gap-3`}>
            <Ionicons name="book-outline" size={40} color={Midnight.textSecondary} />
            <AppText variant="body">No courses available yet</AppText>
            <AppText variant="caption">Content for this track is coming soon.</AppText>
          </View>
        )}
      </ScrollView>
    </>
  );
}
