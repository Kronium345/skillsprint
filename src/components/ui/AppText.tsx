import React from 'react';
import { Text, type TextProps } from 'react-native';

import tw from '@/lib/twrnc';

type Variant = 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'link';

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

const variantStyles: Record<Variant, ReturnType<typeof tw>> = {
  hero: tw`font-display text-4xl text-foreground`,
  title: tw`font-display text-2xl text-foreground`,
  subtitle: tw`font-display text-xl text-foreground`,
  body: tw`font-body text-base text-foreground`,
  caption: tw`font-body text-sm text-foreground-muted`,
  label: tw`font-body text-sm text-foreground font-medium`,
  link: tw`font-body text-sm text-primary`,
};

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  return (
    <Text
      style={[variantStyles[variant], muted && tw`text-foreground-muted`, style]}
      {...rest}
    />
  );
}
