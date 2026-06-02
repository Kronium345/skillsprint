import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import api from '@/lib/api';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';
import type { CourseSummary, LessonListItem } from '@/types/content';

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  const {
    data: course,
    isLoading: loadingCourse,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await api.get<CourseSummary>(`/courses/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });

  const {
    data: lessons,
    isLoading: loadingLessons,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const { data } = await api.get<LessonListItem[]>(`/courses/${courseId}/lessons`);
      return data;
    },
    enabled: !!courseId,
  });

  const progress = useMemo(() => {
    if (!lessons || lessons.length === 0) return { completed: 0, total: 0, pct: 0 };
    const completed = lessons.filter((l) => l.completed).length;
    return { completed, total: lessons.length, pct: Math.round((completed / lessons.length) * 100) };
  }, [lessons]);

  const isLoading = loadingCourse || loadingLessons;

  useEffect(() => {
    if (!course) return;
    AsyncStorage.multiSet([
      ['lastCourseId', course._id],
      ['lastCourseTitle', course.title],
    ]).catch(() => {
      // Non-blocking: reminders can still work without this.
    });
  }, [course]);

  return (
    <>
      <Stack.Screen options={{ title: course?.title ?? 'Course' }} />
      <ScrollView
        style={{ backgroundColor: Midnight.background }}
        contentContainerStyle={tw`p-6 gap-5 pb-10`}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={Midnight.primary}
            colors={[Midnight.primary]}
          />
        }>
        {isLoading ? (
          <ActivityIndicator color={Midnight.primary} style={tw`mt-8`} />
        ) : (
          <>
            {course?.description && (
              <AppText variant="caption">{course.description}</AppText>
            )}

            {course && (
              <View style={tw`flex-row gap-3`}>
                {course.difficulty && (
                  <View
                    style={[
                      tw`rounded-full px-3 py-1`,
                      { backgroundColor: Midnight.elevated },
                    ]}>
                    <AppText variant="caption" style={tw`text-foreground`}>
                      {course.difficulty}
                    </AppText>
                  </View>
                )}
                {course.durationMinutes > 0 && (
                  <View
                    style={[
                      tw`rounded-full px-3 py-1`,
                      { backgroundColor: Midnight.elevated },
                    ]}>
                    <AppText variant="caption" style={tw`text-foreground`}>
                      {course.durationMinutes} min
                    </AppText>
                  </View>
                )}
              </View>
            )}

            {progress.total > 0 && (
              <View style={tw`gap-2`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <AppText variant="label">Progress</AppText>
                  <AppText variant="caption" style={tw`text-primary`}>
                    {progress.completed}/{progress.total} lessons · {progress.pct}%
                  </AppText>
                </View>
                <View
                  style={[
                    tw`h-2 rounded-full overflow-hidden`,
                    { backgroundColor: Midnight.elevated },
                  ]}>
                  <LinearGradient
                    colors={[...Midnight.gradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      tw`h-full rounded-full`,
                      { width: `${progress.pct}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            <AppText variant="label">Lessons</AppText>

            {lessons?.map((lesson, index) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} asChild>
                <Pressable
                  style={(state) => [
                    tw`rounded-card-lg border border-border p-4 flex-row items-center gap-3`,
                    { backgroundColor: Midnight.surface },
                    state.pressed && tw`border-primary`,
                  ]}>
                  <View
                    style={[
                      tw`w-8 h-8 rounded-full items-center justify-center`,
                      {
                        backgroundColor: lesson.completed
                          ? Midnight.success + '20'
                          : Midnight.elevated,
                      },
                    ]}>
                    {lesson.completed ? (
                      <Ionicons name="checkmark" size={16} color={Midnight.success} />
                    ) : (
                      <AppText variant="caption" style={tw`text-foreground`}>
                        {index + 1}
                      </AppText>
                    )}
                  </View>
                  <View style={tw`flex-1 gap-1`}>
                    <AppText variant="label">{lesson.title}</AppText>
                    <AppText variant="caption" numberOfLines={2}>
                      {lesson.summary}
                    </AppText>
                    <View style={tw`flex-row items-center gap-2`}>
                      <AppText variant="caption">{lesson.durationMinutes} min</AppText>
                      {lesson.videoUrl && (
                        <View style={tw`flex-row items-center gap-1`}>
                          <Ionicons name="videocam-outline" size={12} color={Midnight.textSecondary} />
                          <AppText variant="caption">Video</AppText>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Midnight.textSecondary} />
                </Pressable>
              </Link>
            ))}

            {(!lessons || lessons.length === 0) && (
              <View style={tw`items-center py-8 gap-3`}>
                <Ionicons name="book-outline" size={40} color={Midnight.textSecondary} />
                <AppText variant="caption">No lessons available yet.</AppText>
                <AppText variant="caption">Check back soon!</AppText>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}
