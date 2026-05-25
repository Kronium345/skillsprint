import React from 'react';
import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';

import tw from '@/lib/twrnc';

type Props = ViewProps & {
  pressed?: boolean;
};

export function GlassCard({ children, style, ...rest }: Props) {
  return (
    <View
      style={[
        tw`rounded-card-lg border border-border bg-surface p-4`,
        {
          shadowColor: '#4F8CFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

type PressableCardProps = PressableProps;

export function GlassCardPressable({ children, style, ...rest }: PressableCardProps) {
  return (
    <Pressable
      style={(state) => {
        const resolved = typeof style === 'function' ? style(state) : style;
        return [
          tw`rounded-card-lg border border-border bg-surface p-4`,
          state.pressed && { borderColor: 'rgba(79, 140, 255, 0.45)', opacity: 0.92 },
          resolved,
        ];
      }}
      {...rest}>
      {children}
    </Pressable>
  );
}
