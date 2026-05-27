import React from 'react';
import { Platform, Text, View } from 'react-native';

import { Midnight } from '@/theme/midnight';

const fonts = {
  heading: Platform.select({ ios: 'SpaceGrotesk_700Bold', android: 'SpaceGrotesk_700Bold', default: undefined }),
  headingSemi: Platform.select({ ios: 'SpaceGrotesk_600SemiBold', android: 'SpaceGrotesk_600SemiBold', default: undefined }),
  body: Platform.select({ ios: 'Inter_400Regular', android: 'Inter_400Regular', default: undefined }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\*(.+?)\*)|(_(.+?)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(
        <Text key={key++} style={{ fontWeight: '600', color: Midnight.textPrimary }}>
          {match[2]}
        </Text>,
      );
    } else if (match[4]) {
      parts.push(
        <Text
          key={key++}
          style={{
            fontFamily: fonts.mono,
            fontSize: 13,
            color: Midnight.accent,
            backgroundColor: Midnight.elevated,
            borderRadius: 4,
          }}>
          {' '}{match[4]}{' '}
        </Text>,
      );
    } else if (match[6]) {
      parts.push(
        <Text key={key++} style={{ fontStyle: 'italic', color: Midnight.textSecondary }}>
          {match[6]}
        </Text>,
      );
    } else if (match[8]) {
      parts.push(
        <Text key={key++} style={{ fontStyle: 'italic', color: Midnight.textSecondary }}>
          {match[8]}
        </Text>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'code'; lines: string[] }
  | { type: 'hr' };

function parseBlocks(source: string): Block[] {
  const lines = source.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lines: codeLines });
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2) });
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'bullet', items });
      continue;
    }

    if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ordered', items });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    let para = line;
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+[.)]\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      para += ' ' + lines[i];
      i++;
    }
    blocks.push({ type: 'paragraph', text: para });
  }

  return blocks;
}

type Props = {
  children: string;
};

export function MarkdownContent({ children }: Props) {
  const blocks = parseBlocks(children);

  return (
    <View style={{ gap: 4 }}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <Text
                key={idx}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 24,
                  fontWeight: '700',
                  color: Midnight.textPrimary,
                  marginTop: 16,
                  marginBottom: 6,
                }}>
                {renderInline(block.text)}
              </Text>
            );
          case 'h2':
            return (
              <Text
                key={idx}
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 20,
                  fontWeight: '700',
                  color: Midnight.textPrimary,
                  marginTop: 14,
                  marginBottom: 4,
                }}>
                {renderInline(block.text)}
              </Text>
            );
          case 'h3':
            return (
              <Text
                key={idx}
                style={{
                  fontFamily: fonts.headingSemi,
                  fontSize: 17,
                  fontWeight: '600',
                  color: Midnight.textPrimary,
                  marginTop: 10,
                  marginBottom: 2,
                }}>
                {renderInline(block.text)}
              </Text>
            );
          case 'paragraph':
            return (
              <Text
                key={idx}
                style={{
                  fontFamily: fonts.body,
                  fontSize: 15,
                  lineHeight: 24,
                  color: Midnight.textPrimary,
                  marginBottom: 10,
                }}>
                {renderInline(block.text)}
              </Text>
            );
          case 'bullet':
            return (
              <View key={idx} style={{ marginBottom: 10, paddingLeft: 4 }}>
                {block.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text style={{ color: Midnight.primary, fontSize: 16, lineHeight: 24, width: 18 }}>
                      {'\u2022'}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 15,
                        lineHeight: 24,
                        color: Midnight.textPrimary,
                        flex: 1,
                      }}>
                      {renderInline(item)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          case 'ordered':
            return (
              <View key={idx} style={{ marginBottom: 10, paddingLeft: 4 }}>
                {block.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text
                      style={{
                        color: Midnight.primary,
                        fontSize: 15,
                        lineHeight: 24,
                        width: 24,
                        fontWeight: '600',
                      }}>
                      {j + 1}.
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 15,
                        lineHeight: 24,
                        color: Midnight.textPrimary,
                        flex: 1,
                      }}>
                      {renderInline(item)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          case 'code':
            return (
              <View
                key={idx}
                style={{
                  backgroundColor: Midnight.elevated,
                  borderColor: Midnight.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 14,
                  marginVertical: 8,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    lineHeight: 20,
                    color: Midnight.accent,
                  }}>
                  {block.lines.join('\n')}
                </Text>
              </View>
            );
          case 'hr':
            return (
              <View
                key={idx}
                style={{
                  height: 1,
                  backgroundColor: Midnight.border,
                  marginVertical: 14,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
}
