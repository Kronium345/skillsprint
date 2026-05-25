import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';

import tw from '@/lib/twrnc';
import { Midnight } from '@/theme/midnight';

type Props = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
};

export function GradientButton({
  label,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: Props) {
  if (variant === 'outline') {
    return (
      <Pressable
        style={(state) => {
          const resolved = typeof style === 'function' ? style(state) : style;
          return [
            tw`rounded-card-lg border border-border-glow py-4 items-center`,
            state.pressed && tw`opacity-90`,
            disabled && tw`opacity-50`,
            resolved,
          ];
        }}
        disabled={disabled || loading}
        {...rest}>
        <Text style={tw`font-body text-base text-foreground font-medium`}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={(state) => {
        const resolved = typeof style === 'function' ? style(state) : style;
        return [
          tw`rounded-card-lg overflow-hidden`,
          state.pressed && tw`opacity-90`,
          disabled && tw`opacity-50`,
          resolved,
        ];
      }}
      disabled={disabled || loading}
      {...rest}>
      <LinearGradient
        colors={[...Midnight.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`py-4 px-6 items-center justify-center`}>
        {loading ? (
          <ActivityIndicator color={Midnight.textPrimary} />
        ) : (
          <Text style={tw`font-display text-base text-foreground font-semibold`}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
