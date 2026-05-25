import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: Edge[];
  safe?: boolean;
  padded?: boolean;
};

/** Layered Midnight background gradient */
export function Screen({
  children,
  style,
  contentStyle,
  edges = ['top'],
  safe = true,
  padded = true,
}: Props) {
  const padding = padded ? tw`px-6` : undefined;

  const inner = safe ? (
    <SafeAreaView style={[tw`flex-1`, padding, contentStyle, style]} edges={edges}>
      {children}
    </SafeAreaView>
  ) : (
    <View style={[tw`flex-1`, padding, contentStyle, style]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[...Midnight.backgroundGradient]}
      style={tw`flex-1`}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      {inner}
    </LinearGradient>
  );
}
