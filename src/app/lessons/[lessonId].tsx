import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { FlashcardDeck } from '@/components/FlashcardDeck';
import { LessonQuiz } from '@/components/LessonQuiz';
import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/lib/api';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';
import type { LessonDetail, LessonListItem } from '@/types/content';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { updateUser } = useAuth();
  const [tutorMessage, setTutorMessage] = useState('');
  const [tutorReply, setTutorReply] = useState<string | null>(null);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data } = await api.get<LessonDetail>(`/courses/lessons/${lessonId}`);
      return data;
    },
    enabled: !!lessonId,
  });

  const { data: siblings } = useQuery({
    queryKey: ['lessons', lesson?.courseId],
    queryFn: async () => {
      const { data } = await api.get<LessonListItem[]>(`/courses/${lesson!.courseId}/lessons`);
      return data;
    },
    enabled: !!lesson?.courseId,
  });

  const currentIdx = siblings?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIdx > 0 ? siblings?.[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && siblings ? siblings[currentIdx + 1] ?? null : null;

  const completeMutation = useMutation({
    mutationFn: async (quizScore: number | undefined) => {
      const score = quizScore ?? lesson?.quiz.length ?? 0;
      const { data } = await api.post<{ xpTotal: number; streakCount: number; xpEarned: number }>(
        `/courses/lessons/${lessonId}/complete`,
        { score },
      );
      return data;
    },
    onSuccess: (data) => {
      updateUser({ xp: data.xpTotal, streak: data.streakCount });
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lessons', lesson?.courseId] });
      Alert.alert('Lesson complete', `+${data.xpEarned} XP earned!`);
    },
  });

  const tutorMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ reply: string }>('/ai/tutor', {
        message: tutorMessage,
        lessonTitle: lesson?.title,
        lessonContent: lesson?.content,
      });
      return data.reply;
    },
    onSuccess: (reply) => {
      setTutorReply(reply);
      setTutorMessage('');
    },
    onError: () =>
      Alert.alert('AI tutor', 'Sign in and set GEMINI_API_KEY on the server to use the tutor.'),
  });

  const openVideo = async () => {
    if (lesson?.videoUrl) await WebBrowser.openBrowserAsync(lesson.videoUrl);
  };

  const handleQuizComplete = (score: number, _total: number) => {
    completeMutation.mutate(score);
  };

  if (isLoading || !lesson) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: Midnight.background }]}>
        <ActivityIndicator color={Midnight.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: lesson.title }} />
      <ScrollView
        style={{ backgroundColor: Midnight.background }}
        contentContainerStyle={tw`p-6 gap-6 pb-16`}>

        {lesson.progress?.completed && (
          <View
            style={[
              tw`flex-row items-center gap-2 rounded-card px-4 py-2`,
              { backgroundColor: Midnight.success + '18' },
            ]}>
            <Ionicons name="checkmark-circle" size={20} color={Midnight.success} />
            <AppText variant="label" style={tw`text-success`}>
              Completed{lesson.progress.xpEarned ? ` · +${lesson.progress.xpEarned} XP` : ''}
            </AppText>
          </View>
        )}

        {lesson.summary ? (
          <AppText variant="caption">{lesson.summary}</AppText>
        ) : null}

        {lesson.videoUrl && (
          <Pressable
            onPress={openVideo}
            style={[
              tw`rounded-card-lg border border-border p-4 flex-row items-center gap-3`,
              { backgroundColor: Midnight.danger + '12' },
            ]}>
            <View
              style={[
                tw`w-10 h-10 rounded-full items-center justify-center`,
                { backgroundColor: Midnight.danger + '25' },
              ]}>
              <Ionicons name="logo-youtube" size={22} color={Midnight.danger} />
            </View>
            <View style={tw`flex-1`}>
              <AppText variant="label">Watch video lesson</AppText>
              <AppText variant="caption">Opens in YouTube</AppText>
            </View>
            <Ionicons name="open-outline" size={18} color={Midnight.textSecondary} />
          </Pressable>
        )}

        <AppText variant="body" style={tw`leading-7`}>
          {lesson.content}
        </AppText>

        {lesson.keyTerms.length > 0 && (
          <View style={tw`gap-2`}>
            <AppText variant="label">Key terms</AppText>
            <View style={tw`flex-row flex-wrap gap-2`}>
              {lesson.keyTerms.map((term) => (
                <View
                  key={term}
                  style={[
                    tw`rounded-full px-3 py-1 border`,
                    { backgroundColor: Midnight.elevated, borderColor: Midnight.border },
                  ]}>
                  <AppText variant="caption" style={tw`text-foreground`}>
                    {term}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {lesson.flashcards.length > 0 && (
          <View style={tw`gap-3`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Ionicons name="albums-outline" size={20} color={Midnight.accent} />
              <AppText variant="subtitle">Flashcards</AppText>
            </View>
            <FlashcardDeck cards={lesson.flashcards} />
          </View>
        )}

        {lesson.quiz.length > 0 && (
          <View style={tw`gap-3`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Ionicons name="help-circle-outline" size={20} color={Midnight.secondary} />
              <AppText variant="subtitle">Quiz</AppText>
            </View>
            <LessonQuiz
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
              alreadyCompleted={lesson.progress?.completed}
            />
          </View>
        )}

        {lesson.quiz.length === 0 && !lesson.progress?.completed && (
          <GradientButton
            label="Mark lesson complete"
            onPress={() => completeMutation.mutate(undefined)}
            loading={completeMutation.isPending}
          />
        )}

        <View style={tw`gap-3 mt-2`}>
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="sparkles" size={20} color={Midnight.secondary} />
            <AppText variant="subtitle">AI Tutor</AppText>
          </View>
          <TextInput
            style={[
              tw`rounded-card-lg border border-border px-4 py-3 font-body text-base`,
              { backgroundColor: Midnight.surface, color: Midnight.textPrimary },
            ]}
            placeholder="Ask a question about this lesson…"
            placeholderTextColor={Midnight.textSecondary}
            value={tutorMessage}
            onChangeText={setTutorMessage}
            multiline
          />
          <GradientButton
            label="Ask tutor"
            variant="outline"
            onPress={() => tutorMutation.mutate()}
            loading={tutorMutation.isPending}
            disabled={!tutorMessage.trim()}
          />
          {tutorReply && (
            <View
              style={[
                tw`rounded-card-lg border p-4`,
                { backgroundColor: Midnight.secondary + '10', borderColor: Midnight.secondary + '30' },
              ]}>
              <AppText variant="body" style={tw`leading-6`}>
                {tutorReply}
              </AppText>
            </View>
          )}
        </View>

        {(prevLesson || nextLesson) && (
          <View style={tw`flex-row gap-3 mt-4`}>
            {prevLesson ? (
              <Pressable
                onPress={() => router.replace(`/lessons/${prevLesson.id}`)}
                style={[
                  tw`flex-1 rounded-card-lg border border-border p-4 gap-1`,
                  { backgroundColor: Midnight.surface },
                ]}>
                <View style={tw`flex-row items-center gap-1`}>
                  <Ionicons name="chevron-back" size={14} color={Midnight.textSecondary} />
                  <AppText variant="caption">Previous</AppText>
                </View>
                <AppText variant="label" numberOfLines={1}>
                  {prevLesson.title}
                </AppText>
              </Pressable>
            ) : (
              <View style={tw`flex-1`} />
            )}
            {nextLesson ? (
              <Pressable
                onPress={() => router.replace(`/lessons/${nextLesson.id}`)}
                style={[
                  tw`flex-1 rounded-card-lg border border-border p-4 gap-1 items-end`,
                  { backgroundColor: Midnight.surface },
                ]}>
                <View style={tw`flex-row items-center gap-1`}>
                  <AppText variant="caption">Next</AppText>
                  <Ionicons name="chevron-forward" size={14} color={Midnight.textSecondary} />
                </View>
                <AppText variant="label" numberOfLines={1}>
                  {nextLesson.title}
                </AppText>
              </Pressable>
            ) : (
              <View style={tw`flex-1`} />
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}
