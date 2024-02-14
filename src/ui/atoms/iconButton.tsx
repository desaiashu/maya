import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  ImageStyle,
  useColorScheme,
} from 'react-native';
import { getIconSource } from '@/data';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  style?: StyleProp<ImageStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onPress, style }) => {
  const colorScheme = useColorScheme();
  const styles = getStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={getIconSource(icon, colorScheme)} // Replace with the actual path to your image
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
  });

export default IconButton;
