import React from 'react';
import { StyleSheet, Image, useColorScheme } from 'react-native';
import { getAvatarSource, getDefaultAvatar } from '@/data';

interface AvatarProps {
  position: 'left' | 'right';
  avatar: string;
}

const Avatar: React.FC<AvatarProps> = props => {
  const { position, avatar } = props;
  const colorScheme = useColorScheme();

  return (
    <Image
      source={getAvatarSource(avatar, colorScheme)}
      defaultSource={getDefaultAvatar(colorScheme)} // Default avatar before remote image loads
      style={[styles.base, styles[position]]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    height: 36,
    width: 36,
    marginBottom: -2,
  },
  left: {
    marginLeft: 5,
  },
  right: {
    marginLeft: 5,
  },
});

export default Avatar;
