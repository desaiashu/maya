import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Words } from '@/ui/atoms';
import { Theme, useTheme } from '@/ui/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  outlined?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, outlined }) => {
  const theme = useTheme();
  if (outlined === undefined) {
    outlined = false;
  }
  const styles = getStyles(theme, outlined);

  return (
    <TouchableOpacity style={[styles.textButton, style]} onPress={onPress}>
      <Words tag="button" alt={outlined}>
        {title}
      </Words>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, outlined: boolean) =>
  StyleSheet.create({
    textButton: {
      backgroundColor: outlined ? theme.colors.background : theme.colors.button,
      borderWidth: outlined ? 1 : 0,
      borderColor: theme.colors.outline,
      paddingTop: 14, // Add padding
      paddingBottom: 14, // Add padding
      paddingLeft: 20, // Add padding
      paddingRight: 20, // Add padding
      borderRadius: 5, // Add rounded corners
      margin: 10,
    },
  });

export default Button;
