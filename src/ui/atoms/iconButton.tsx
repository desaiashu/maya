import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  useColorScheme,
  StyleProp,
  Image,
  ImageStyle,
} from 'react-native';
// import FastImage, { ImageStyle } from 'react-native-fast-image';
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

  const animated = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animated, {
      toValue: 0.25,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: animated }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          round && styles.round,
          shadow && styles.shadow,
          containerStyle,
        ]}
      >
        {/* <FastImage */}
        <Image
          source={getImageSource(icon, colorScheme)} // Replace with the actual path to your image
          style={[styles.iconButton, style]} // Adjust the size as needed
        />
      </Pressable>
    </Animated.View>
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
      elevation: 10,
    },
  });

export default IconButton;
