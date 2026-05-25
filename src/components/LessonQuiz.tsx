import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { GradientButton } from '@/components/ui/GradientButton';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';
import type { LessonDetail } from '@/types/content';

type QuizQuestion = LessonDetail['quiz'][number];

type Props = {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  alreadyCompleted?: boolean;
};

export function LessonQuiz({ questions, onComplete, alreadyCompleted }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const correctIndex = useMemo(
    () => current?.options.findIndex((o) => o.isCorrect) ?? -1,
    [current],
  );

  const score = useMemo(() => results.filter(Boolean).length, [results]);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return;
      setSelectedIndex(index);
      setAnswered(true);
      setResults((prev) => [...prev, index === correctIndex]);
    },
    [answered, correctIndex],
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  }, [currentIndex, questions.length]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setResults([]);
    setFinished(false);
  }, []);

  if (questions.length === 0) return null;

  if (finished) {
    return (
      <View style={[tw`rounded-card-lg p-6 gap-4 items-center`, { backgroundColor: Midnight.surface }]}>
        <View
          style={[
            tw`w-16 h-16 rounded-full items-center justify-center`,
            { backgroundColor: score / questions.length >= 0.7 ? Midnight.success + '22' : Midnight.warning + '22' },
          ]}>
          <Ionicons
            name={score / questions.length >= 0.7 ? 'checkmark-circle' : 'refresh-circle'}
            size={36}
            color={score / questions.length >= 0.7 ? Midnight.success : Midnight.warning}
          />
        </View>
        <AppText variant="subtitle">
          {score} / {questions.length}
        </AppText>
        <AppText variant="caption">
          {score === questions.length
            ? 'Perfect score!'
            : score / questions.length >= 0.7
              ? 'Great job!'
              : 'Keep practicing!'}
        </AppText>
        <View style={tw`flex-row gap-3 w-full`}>
          <View style={tw`flex-1`}>
            <GradientButton label="Retry" variant="outline" onPress={handleRetry} />
          </View>
          {!alreadyCompleted && (
            <View style={tw`flex-1`}>
              <GradientButton label="Submit score" onPress={() => onComplete(score, questions.length)} />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[tw`rounded-card-lg p-5 gap-4`, { backgroundColor: Midnight.surface }]}>
      <View style={tw`flex-row items-center justify-between`}>
        <AppText variant="label">
          Question {currentIndex + 1} of {questions.length}
        </AppText>
        <View style={tw`flex-row gap-1`}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                tw`w-2 h-2 rounded-full`,
                {
                  backgroundColor:
                    i < results.length
                      ? results[i]
                        ? Midnight.success
                        : Midnight.danger
                      : i === currentIndex
                        ? Midnight.primary
                        : Midnight.elevated,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <AppText variant="body" style={tw`font-medium`}>
        {current.question}
      </AppText>

      <View style={tw`gap-2`}>
        {current.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === correctIndex;
          let borderColor: string = Midnight.border;
          let bgColor: string = Midnight.elevated;
          let iconName: 'checkmark-circle' | 'close-circle' | 'ellipse-outline' = 'ellipse-outline';
          let iconColor: string = Midnight.textSecondary;

          if (answered) {
            if (isCorrect) {
              borderColor = Midnight.success;
              bgColor = Midnight.success + '15';
              iconName = 'checkmark-circle';
              iconColor = Midnight.success;
            } else if (isSelected && !isCorrect) {
              borderColor = Midnight.danger;
              bgColor = Midnight.danger + '15';
              iconName = 'close-circle';
              iconColor = Midnight.danger;
            }
          } else if (isSelected) {
            borderColor = Midnight.primary;
            bgColor = Midnight.primary + '15';
          }

          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              disabled={answered}
              style={[
                tw`rounded-card border p-4 flex-row items-center gap-3`,
                { borderColor, backgroundColor: bgColor },
              ]}>
              <Ionicons name={iconName} size={22} color={iconColor} />
              <AppText variant="body" style={tw`flex-1`}>
                {option.text}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {answered && current.explanation && (
        <View style={[tw`rounded-card p-3`, { backgroundColor: Midnight.primary + '12' }]}>
          <AppText variant="caption" style={tw`text-foreground`}>
            {current.explanation}
          </AppText>
        </View>
      )}

      {answered && (
        <GradientButton
          label={currentIndex + 1 < questions.length ? 'Next question' : 'See results'}
          onPress={handleNext}
        />
      )}
    </View>
  );
}
