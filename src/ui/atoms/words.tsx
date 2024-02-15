import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme, FontTag } from '@/ui/theme';

interface WordsProps {
  tag: FontTag;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  alt?: boolean;
  button?: boolean;
}

const Words: React.FC<WordsProps> = ({ tag, children, style, alt, button }) => {
  const theme = useTheme();
  if (alt === undefined) {
    alt = false;
  }
  if (button === undefined) {
    button = false;
  }

  const styles = getStyles(theme, tag, alt, button);

  return <Text style={[styles.textColor, styles.font, style]}>{children}</Text>;
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
    textColor: {
      color: getColor(theme, tag, alt, button),
    },
    font: theme.fonts[tag],
  });

export default Words;
