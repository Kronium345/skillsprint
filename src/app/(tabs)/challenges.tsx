import { Ionicons } from '@expo/vector-icons';
import { useQueries, useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { Screen } from '@/components/ui/Screen';
import api from '@/lib/api';
import tw from '@/lib/twrnc';
import { useAuth } from '@/providers/AuthProvider';
import { Midnight } from '@/theme/midnight';
import type { CourseSummary, LessonListItem } from '@/types/content';

type ChallengeBadge = {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function ChallengesScreen() {
  const { user } = useAuth();
  const {
    data: courses,
    isLoading: isCoursesLoading,
    refetch: refetchCourses,
    isRefetching,
  } = useQuery({
    queryKey: ['courses-all'],
    queryFn: async () => {
      const { data } = await api.get<CourseSummary[]>('/courses');
      return data;
    },
  });

  const lessonQueries = useQueries({
    queries: (courses ?? []).map((course) => ({
      queryKey: ['lessons', course._id],
      queryFn: async () => {
        const { data } = await api.get<LessonListItem[]>(`/courses/${course._id}/lessons`);
        return data;
      },
      enabled: !!course._id,
    })),
  });

  const hasLessonLoading = lessonQueries.some((q) => q.isLoading);
  const hasLessonError = lessonQueries.some((q) => q.isError);
  const isLoading = isCoursesLoading || hasLessonLoading;

  const courseProgress = useMemo(() => {
    if (!courses) return [];
    return courses.map((course, idx) => {
      const lessons = lessonQueries[idx]?.data ?? [];
      const completed = lessons.filter((l) => l.completed).length;
      const total = lessons.length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { course, completed, total, pct };
    });
  }, [courses, lessonQueries]);

  const stats = useMemo(() => {
    const totalLessons = courseProgress.reduce((sum, c) => sum + c.total, 0);
    const completedLessons = courseProgress.reduce((sum, c) => sum + c.completed, 0);
    const completedCourses = courseProgress.filter((c) => c.total > 0 && c.completed === c.total).length;
    const startedTracks = new Set(
      courseProgress.filter((c) => c.completed > 0).map((c) => c.course.trackSlug),
    ).size;
    return { totalLessons, completedLessons, completedCourses, startedTracks };
  }, [courseProgress]);

  const badges = useMemo<ChallengeBadge[]>(
    () => [
      {
        id: 'first-lesson',
        label: 'First Step',
        description: 'Complete your first lesson',
        unlocked: stats.completedLessons >= 1,
        icon: 'rocket-outline',
      },
      {
        id: 'lesson-sprint',
        label: 'Lesson Sprint',
        description: 'Complete 5 lessons',
        unlocked: stats.completedLessons >= 5,
        icon: 'flash-outline',
      },
      {
        id: 'course-finisher',
        label: 'Course Finisher',
        description: 'Complete one full course',
        unlocked: stats.completedCourses >= 1,
        icon: 'ribbon-outline',
      },
      {
        id: 'track-explorer',
        label: 'Track Explorer',
        description: 'Start learning in 2 tracks',
        unlocked: stats.startedTracks >= 2,
        icon: 'compass-outline',
      },
      {
        id: 'xp-master',
        label: 'XP Builder',
        description: 'Reach 500 XP',
        unlocked: (user?.xp ?? 0) >= 500,
        icon: 'trophy-outline',
      },
      {
        id: 'streak-keeper',
        label: 'Streak Keeper',
        description: 'Reach a 7-day streak',
        unlocked: (user?.streak ?? 0) >= 7,
        icon: 'flame-outline',
      },
    ],
    [stats, user?.streak, user?.xp],
  );

  const leaderboard = useMemo(
    () =>
      [...courseProgress]
        .filter((c) => c.total > 0)
        .sort((a, b) => b.pct - a.pct || b.completed - a.completed)
        .slice(0, 5),
    [courseProgress],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={tw`px-6 pb-10 gap-4`}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetchCourses()}
            tintColor={Midnight.primary}
            colors={[Midnight.primary]}
          />
        }>
        <View style={tw`pt-2 gap-1`}>
          <AppText variant="title">Challenges</AppText>
          <AppText variant="caption">
            Progress-based badges and live rankings from your course data.
          </AppText>
        </View>

        {isLoading ? (
          <View style={tw`py-8 items-center`}>
            <ActivityIndicator color={Midnight.primary} />
          </View>
        ) : (
          <>
            <GlassCard style={tw`gap-3`}>
              <View style={tw`flex-row justify-between`}>
                <View style={tw`items-center flex-1`}>
                  <AppText variant="subtitle">{stats.completedLessons}</AppText>
                  <AppText variant="caption">Lessons done</AppText>
                </View>
                <View style={tw`items-center flex-1`}>
                  <AppText variant="subtitle">{stats.completedCourses}</AppText>
                  <AppText variant="caption">Courses done</AppText>
                </View>
                <View style={tw`items-center flex-1`}>
                  <AppText variant="subtitle">{user?.xp ?? 0}</AppText>
                  <AppText variant="caption">XP</AppText>
                </View>
              </View>
            </GlassCard>

            <AppText variant="label">Achievements</AppText>
            <View style={tw`gap-3`}>
              {badges.map((badge) => (
                <GlassCard
                  key={badge.id}
                  style={[
                    tw`flex-row items-center gap-3`,
                    { opacity: badge.unlocked ? 1 : 0.65 },
                  ]}>
                  <View
                    style={[
                      tw`w-10 h-10 rounded-full items-center justify-center`,
                      {
                        backgroundColor: badge.unlocked
                          ? Midnight.gamification.achievement + '22'
                          : Midnight.elevated,
                      },
                    ]}>
                    <Ionicons
                      name={badge.icon}
                      size={20}
                      color={badge.unlocked ? Midnight.gamification.achievement : Midnight.textSecondary}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <AppText variant="label">{badge.label}</AppText>
                    <AppText variant="caption">{badge.description}</AppText>
                  </View>
                  <AppText variant="caption" style={badge.unlocked ? tw`text-success` : undefined}>
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </AppText>
                </GlassCard>
              ))}
            </View>

            <AppText variant="label">Course leaderboard</AppText>
            <GlassCard style={tw`gap-2`}>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <View key={entry.course._id} style={tw`flex-row items-center gap-3 py-1`}>
                    <View
                      style={[
                        tw`w-7 h-7 rounded-full items-center justify-center`,
                        { backgroundColor: Midnight.elevated },
                      ]}>
                      <AppText variant="caption" style={tw`text-foreground`}>
                        {index + 1}
                      </AppText>
                    </View>
                    <View style={tw`flex-1`}>
                      <AppText variant="caption" style={tw`text-foreground`}>
                        {entry.course.title}
                      </AppText>
                      <AppText variant="caption">
                        {entry.completed}/{entry.total} lessons
                      </AppText>
                    </View>
                    <AppText variant="caption" style={tw`text-primary`}>
                      {entry.pct}%
                    </AppText>
                  </View>
                ))
              ) : (
                <AppText variant="caption">No progress yet. Start a lesson to rank courses.</AppText>
              )}
            </GlassCard>

            {hasLessonError && (
              <AppText variant="caption" style={tw`text-warning`}>
                Some lesson progress could not be loaded. Pull to refresh.
              </AppText>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
