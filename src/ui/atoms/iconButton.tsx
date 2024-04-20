import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  StyleProp,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { getImageSource } from '@/data';
import { Theme, useTheme } from '@/ui/theme';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ImageStyle>;
  round?: boolean;
  shadow?: boolean;
}

const IconButton: React.FC<IconButtonProps> = props => {
  const { icon, onPress, shadow, round, style, containerStyle } = props;
  const colorScheme = useColorScheme();

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        round && styles.round,
        shadow && styles.shadow,
        containerStyle,
      ]}
    >
      <FastImage
        source={getImageSource(icon, colorScheme)} // Replace with the actual path to your image
        style={[styles.iconButton, style]} // Adjust the size as needed
      />
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      justifyContent: 'center', // Center vertically
      alignItems: 'center',
    },
    iconButton: {
      width: 45, // Adjust the size as needed
      height: 45, // Adjust the size as needed
    },
    round: {
      borderRadius: 20,
    },
    shadow: {
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
  });

export default IconButton;
