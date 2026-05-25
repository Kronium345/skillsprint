import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Animated, Pressable, View, useWindowDimensions } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

type Card = { id: string; front: string; back: string };

type Props = {
  cards: Card[];
};

function FlashcardItem({ card }: { card: Card }) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = React.useRef(new Animated.Value(0)).current;

  const handleFlip = useCallback(() => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setFlipped((f) => !f);
  }, [flipped, flipAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Pressable onPress={handleFlip} style={tw`w-full min-h-[180px]`}>
      <View style={tw`relative w-full`}>
        <Animated.View
          style={[
            tw`rounded-card-lg border border-border p-5 gap-3 absolute w-full`,
            {
              backgroundColor: Midnight.surface,
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
              opacity: frontOpacity,
              backfaceVisibility: 'hidden',
            },
          ]}>
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="help-circle-outline" size={18} color={Midnight.accent} />
            <AppText variant="caption" style={tw`text-accent`}>
              Tap to reveal
            </AppText>
          </View>
          <AppText variant="body" style={tw`font-medium leading-6`}>
            {card.front}
          </AppText>
        </Animated.View>

        <Animated.View
          style={[
            tw`rounded-card-lg border p-5 gap-3 w-full`,
            {
              backgroundColor: Midnight.primary + '10',
              borderColor: Midnight.primary + '40',
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
              opacity: backOpacity,
              backfaceVisibility: 'hidden',
            },
          ]}>
          <View style={tw`flex-row items-center gap-2`}>
            <Ionicons name="bulb-outline" size={18} color={Midnight.primary} />
            <AppText variant="caption" style={tw`text-primary`}>
              Answer
            </AppText>
          </View>
          <AppText variant="body" style={tw`leading-6`}>
            {card.back}
          </AppText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

export function FlashcardDeck({ cards }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();

  if (cards.length === 0) return null;

  const card = cards[currentIndex];

  return (
    <View style={tw`gap-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <AppText variant="label">
          Card {currentIndex + 1} of {cards.length}
        </AppText>
        <View style={tw`flex-row gap-1`}>
          {cards.map((_, i) => (
            <View
              key={i}
              style={[
                tw`w-2 h-2 rounded-full`,
                { backgroundColor: i === currentIndex ? Midnight.accent : Midnight.elevated },
              ]}
            />
          ))}
        </View>
      </View>

      <FlashcardItem key={card.id} card={card} />

      <View style={tw`flex-row gap-3`}>
        <Pressable
          onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          style={[
            tw`flex-1 rounded-card border border-border py-3 items-center flex-row justify-center gap-2`,
            { backgroundColor: Midnight.elevated, opacity: currentIndex === 0 ? 0.4 : 1 },
          ]}>
          <Ionicons name="chevron-back" size={18} color={Midnight.textPrimary} />
          <AppText variant="label">Previous</AppText>
        </Pressable>
        <Pressable
          onPress={() => setCurrentIndex((i) => Math.min(cards.length - 1, i + 1))}
          disabled={currentIndex === cards.length - 1}
          style={[
            tw`flex-1 rounded-card border border-border py-3 items-center flex-row justify-center gap-2`,
            {
              backgroundColor: Midnight.elevated,
              opacity: currentIndex === cards.length - 1 ? 0.4 : 1,
            },
          ]}>
          <AppText variant="label">Next</AppText>
          <Ionicons name="chevron-forward" size={18} color={Midnight.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
