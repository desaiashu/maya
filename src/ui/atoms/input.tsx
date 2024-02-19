import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme } from '@/ui/theme';

interface InputProps {
  phone?: boolean;
  value: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<TextStyle>;
  caps?: boolean;
}

const Input: React.FC<InputProps> = ({
  phone,
  value,
  onChangeText,
  caps,
  style,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleTextChange = (newText: string) => {
    if (onChangeText === undefined) return;
    if (phone && newText === '') {
      onChangeText('+');
    } else if (phone && !/^\+?[0-9]*$/.test(newText)) {
      onChangeText(value);
    } else {
      onChangeText(newText);
    }
  };

  return (
    <TextInput
      keyboardType={phone ? 'numeric' : 'default'}
      style={[theme.fonts.input, styles.input, style]}
      value={value}
      onChangeText={handleTextChange}
      autoCapitalize={caps ? 'characters' : 'none'}
      autoCorrect={false}
      spellCheck={false}
    />
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 5,
      maxWidth: '70%',
      minWidth: '50%',
      padding: 15,
      margin: 10,
      color: theme.colors.text.primary,
    },
  });

export default Input;
