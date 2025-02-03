import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme, FontTag } from '@/ui/theme';
import Markdown from 'react-native-markdown-display';

interface WordsProps {
  tag: FontTag;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  alt?: boolean;
  button?: boolean;
  markdown?: boolean;
}

const Words: React.FC<WordsProps> = ({
  tag,
  children,
  style,
  alt = false,
  button = false,
  markdown = false,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme, tag, alt, button);

  const processThinkTags = (content: any) => {
    if (typeof content !== 'string' || !content.includes('<think>'))
      return content;
    if (content.includes('</think>')) {
      return (
        '...*thinking*... \n' +
        content.replace(/<think>([\s\S]*?)<\/think>/g, (_, inner) =>
          inner
            .split('\n\n')
            .map((paragraph: string) => paragraph.trim())
            .map((paragraph: string) => `> *${paragraph}*`)
            .join('\n>\n'),
        )
      );
    }
    return (
      '...*thinking*... \n' +
      content.replace(/<think>([\s\S]*)/g, (_, inner) =>
        inner
          .split('\n\n')
          .map((paragraph: string) => paragraph.trim())
          .map((paragraph: string) => `> *${paragraph}*`)
          .join('\n>\n'),
      )
    );
  };

  if (markdown) {
    return (
      <Markdown style={theme.markdown} mergeStyle={false}>
        {processThinkTags(children)}
      </Markdown>
    );
  } else {
    return <Text style={[styles.font, styles.color, style]}>{children}</Text>;
  }
};

const getColor = (
  theme: Theme,
  tag: FontTag,
  alt: boolean,
  button: boolean,
): string => {
  if (button) {
    return alt ? theme.colors.text.primary : theme.colors.text.contrast;
  } else {
    return alt ? theme.colors.text.contrast : theme.colors.text.primary;
  }
};

const getStyles = (
  theme: Theme,
  tag: WordsProps['tag'],
  alt: boolean,
  button: boolean,
) =>
  StyleSheet.create({
    font: {
      ...theme.fonts[tag],
    },
    color: {
      color: getColor(theme, tag, alt, button),
    },
  });

export default Words;
