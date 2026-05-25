import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { getTrackBySlug } from '@/constants/tracks';
import api from '@/lib/api';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';
import type { QuizTopic } from '@/types/lms';

const PLACEHOLDER_TOPICS: Record<string, QuizTopic[]> = {
  'generative-ai': [
    { id: '1', title: 'What is AI?', questionCount: 10, difficulty: 'beginner' },
    { id: '2', title: 'Prompt engineering basics', questionCount: 12, difficulty: 'intermediate' },
    { id: '3', title: 'AI workflows', questionCount: 8, difficulty: 'intermediate' },
  ],
};

async function fetchTopics(trackSlug: string): Promise<QuizTopic[]> {
  try {
    const { data } = await api.get<QuizTopic[]>(`/chapter`, {
      params: { track: trackSlug },
    });
    return data;
  } catch {
    return (
      PLACEHOLDER_TOPICS[trackSlug] ?? [
        {
          id: 'demo-1',
          title: 'Getting started',
          questionCount: 5,
          difficulty: 'beginner',
          trackSlug,
        },
      ]
    );
  }
}

export default function TrackQuizTopicsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const track = getTrackBySlug(slug ?? '');
  const router = useRouter();

  const { data: topics, isLoading } = useQuery({
    queryKey: ['quiz-topics', slug],
    queryFn: () => fetchTopics(slug ?? ''),
    enabled: !!slug,
  });

  const startQuiz = async (topic: QuizTopic) => {
    try {
      await api.post('/quiz/create', { trackSlug: slug, topicId: topic.id });
    } catch {
      // Quiz screen TODO
    }
    router.push({
      pathname: '/(tabs)/challenges',
      params: { topic: topic.title },
    });
  };

  if (!track) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: Midnight.background }]}>
        <AppText>Track not found</AppText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: track.title }} />
      <View style={[tw`flex-1 px-6`, { backgroundColor: Midnight.background }]}>
        <AppText variant="caption" style={tw`mb-4`}>
          {track.subtitle}
        </AppText>

        {isLoading ? (
          <ActivityIndicator color={Midnight.primary} style={tw`mt-6`} />
        ) : (
          <FlatList
            data={topics}
            keyExtractor={(item) => item.id}
            contentContainerStyle={tw`gap-2 pb-10`}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => startQuiz(item)}
                style={({ pressed }) => [
                  tw`flex-row items-center rounded-card-lg border border-border p-4 gap-3`,
                  { backgroundColor: Midnight.surface },
                  pressed && tw`border-primary opacity-90`,
                ]}>
                <View style={tw`flex-1 gap-1`}>
                  <AppText variant="label">{item.title}</AppText>
                  <AppText variant="caption">
                    {item.questionCount ?? '?'} questions
                    {item.difficulty ? ` · ${item.difficulty}` : ''}
                  </AppText>
                </View>
                <AppText variant="link">Start</AppText>
              </Pressable>
            )}
          />
        )}
      </View>
    </>
  );
}
