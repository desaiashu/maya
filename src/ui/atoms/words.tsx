import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme, FontTag } from '@/ui/theme';

interface WordsProps {
    tag: FontTag;
    children: string;
    style?: StyleProp<TextStyle>;
    alt?: boolean;
  }

const Words: React.FC<WordsProps> = ({ tag, children, style, alt }) => {
  const theme = useTheme();
  if (alt === undefined) {
    alt = false;
  }

  const styles = getStyles(theme, tag, alt);

  return (
    <Text style={[styles.color, styles.font, style]}>{children}</Text>
  );
};

// const getColor(theme: Theme, tag: FontTag, alt: boolean): string => {
//   if (tag === 'button') {
//     return alt ? theme.colors.text.primary : theme.colors.text.contrast;
//   } else {
//     return alt ? theme.colors.text.contrast : theme.colors.text.primary;
//   }

// }

const getStyles = (theme: Theme, tag: WordsProps['tag'], alt: boolean) => StyleSheet.create({
  color: {
    color: tag==='button' ? theme.colors.text.contrast : theme.colors.text.primary,
  },
  font: theme.fonts[tag],
});

export default Words;