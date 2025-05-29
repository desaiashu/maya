import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
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
  shadow?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  outlined,
  tag,
  bare,
  shadow,
  disabled,
}) => {
  const theme = useTheme();
  if (outlined === undefined) {
    outlined = false;
  }
  const styles = getStyles(theme, outlined);

  const fontTag = tag || 'button';

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
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          bare ? styles.bare : styles.button,
          !bare && (tag === 'small' ? styles.small : styles.normal),
          shadow && styles.shadow,
          disabled && styles.disabled,
          style,
        ]}
        disabled={disabled}
        onPress={onPress}
      >
        <Words tag={fontTag} alt={outlined || bare} button={true}>
          {title}
        </Words>
      </Pressable>
    </Animated.View>
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
    disabled: {
      opacity: 0.25,
    },
    shadow: {
      borderWidth: 0,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1.5,
      elevation: 5,
    },
    bare: {
      padding: 10,
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
