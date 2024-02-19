import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  StyleProp,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { getImageSource } from '@/data';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ImageStyle>;
}

const IconButton: React.FC<IconButtonProps> = props => {
  const { icon, onPress, style, containerStyle } = props;
  const colorScheme = useColorScheme();
  const styles = getStyles();

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <FastImage
        source={getImageSource(icon, colorScheme)} // Replace with the actual path to your image
        style={[styles.iconButton, style]} // Adjust the size as needed
      />
    </TouchableOpacity>
  );
};

const getStyles = () =>
  StyleSheet.create({
    iconButton: {
      width: 45, // Adjust the size as needed
      height: 45, // Adjust the size as needed
    },
    base: {},
  });

export default IconButton;
