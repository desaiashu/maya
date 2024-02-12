import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme, Theme } from '@/ui/theme';

interface InputProps {
  phone?: boolean;
  value: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<TextStyle>;
}

const Input: React.FC<InputProps> = ({ phone, value, onChangeText }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const handleTextChange = (newText: string) => {
      if (onChangeText === undefined) 
        return;
      if (phone && newText === '' ) {
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
      style={styles.input}
      value={value}
      onChangeText={handleTextChange}
    />
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 5,
        maxWidth: '70%',
        minWidth: '50%',
        padding: 15,
        margin: 10,
        fontSize: theme.fonts.input.fontSize,
        color: theme.colors.text.primary,
      },
  });

export default Input;