import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Words } from '@/ui/atoms';
import { Theme, useTheme, FontTag } from '@/ui/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  outlined?: boolean;
  tag?: FontTag;
  bare?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  outlined,
  tag,
  bare,
}) => {
  const theme = useTheme();
  if (outlined === undefined) {
    outlined = false;
  }
  const styles = getStyles(theme, outlined);

  const fontTag = tag || 'button';

  return (
    <TouchableOpacity
      style={[
        bare ? null : styles.button,
        bare ? null : tag === 'small' ? styles.small : styles.normal,
        style,
      ]}
      onPress={onPress}
    >
      <Words tag={fontTag} alt={outlined || bare} button={true}>
        {title}
      </Words>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, outlined: boolean) =>
  StyleSheet.create({
    button: {
      backgroundColor: outlined ? theme.colors.background : theme.colors.button,
      borderWidth: outlined ? 1 : 0,
      borderColor: theme.colors.outline,
      borderRadius: 5, // Add rounded corners
      margin: 10,
    },
    normal: {
      paddingTop: 14, // Add padding
      paddingBottom: 14, // Add padding
      paddingLeft: 20, // Add padding
      paddingRight: 20, // Add padding
    },
    small: {
      paddingTop: 10, // Add padding
      paddingBottom: 10, // Add padding
      paddingLeft: 14, // Add padding
      paddingRight: 14, // Add padding
    },
  });

export default Button;
