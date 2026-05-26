import React from 'react';
import { Platform } from 'react-native';
import Markdown, { type MarkdownProps } from 'react-native-markdown-display';

import { Midnight } from '@/theme/midnight';

type Styles = MarkdownProps['style'];

const markdownStyles: Styles = {
  body: {
    color: Midnight.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: Platform.select({ ios: 'Inter_400Regular', android: 'Inter_400Regular', default: 'system-ui' }),
  },
  heading1: {
    color: Midnight.textPrimary,
    fontSize: 24,
    fontFamily: Platform.select({ ios: 'SpaceGrotesk_700Bold', android: 'SpaceGrotesk_700Bold', default: 'system-ui' }),
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  heading2: {
    color: Midnight.textPrimary,
    fontSize: 20,
    fontFamily: Platform.select({ ios: 'SpaceGrotesk_700Bold', android: 'SpaceGrotesk_700Bold', default: 'system-ui' }),
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 6,
  },
  heading3: {
    color: Midnight.textPrimary,
    fontSize: 17,
    fontFamily: Platform.select({ ios: 'SpaceGrotesk_600SemiBold', android: 'SpaceGrotesk_600SemiBold', default: 'system-ui' }),
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
  },
  strong: {
    color: Midnight.textPrimary,
    fontWeight: '600',
  },
  em: {
    color: Midnight.textSecondary,
    fontStyle: 'italic',
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    color: Midnight.primary,
    fontSize: 8,
    lineHeight: 24,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: Midnight.primary,
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: Midnight.elevated,
    color: Midnight.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  fence: {
    backgroundColor: Midnight.elevated,
    borderColor: Midnight.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
  },
  code_block: {
    backgroundColor: Midnight.elevated,
    color: Midnight.accent,
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  blockquote: {
    backgroundColor: Midnight.surface,
    borderLeftColor: Midnight.primary,
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 10,
  },
  hr: {
    backgroundColor: Midnight.border,
    height: 1,
    marginVertical: 16,
  },
  link: {
    color: Midnight.primary,
    textDecorationLine: 'underline',
  },
  table: {
    borderColor: Midnight.border,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  tr: {
    borderBottomColor: Midnight.border,
    borderBottomWidth: 1,
  },
  td: {
    padding: 8,
  },
  th: {
    padding: 8,
    backgroundColor: Midnight.elevated,
    fontWeight: '600',
  },
} as Styles;

type Props = {
  children: string;
};

export function MarkdownContent({ children }: Props) {
  return (
    <Markdown style={markdownStyles}>
      {children}
    </Markdown>
  );
}
