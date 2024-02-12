import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme, FontTag } from '@/ui/theme';

interface WordsProps {
    tag: FontTag;
    children: string;
    style?: StyleProp<TextStyle>;
  }

const Words: React.FC<WordsProps> = ({ tag, children, style }) => {
  const theme = useTheme();
  const styles = getStyles(theme, tag);

  return (
    <Text style={[styles.color, styles.font, style]}>{children}</Text>
  );
};

const getStyles = (theme: Theme, tag: WordsProps['tag']) => StyleSheet.create({
  color: {
    color: tag==='button' ? theme.colors.text.contrast : theme.colors.text.primary,
  },
  font: theme.fonts[tag],
});

export default Words;