import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  ColorSchemeName,
  View,
  StyleProp,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { getImageSource } from '@/data';
import { Theme, useTheme } from '@/ui/theme';

interface AvatarProps {
  avatar: string | undefined;
  position?: 'left' | 'right';
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const defaultAvatar = 'local://user.png';
const messageSize = 30;

const Avatar: React.FC<AvatarProps> = props => {
  const { position, avatar, style } = props;
  const colorScheme = useColorScheme();

  const styles = getStyles(useTheme(), props.size ?? messageSize);

  return (
    <View style={styles.container}>
      <FastImage
        source={getAvatarSource(avatar ?? defaultAvatar, colorScheme)}
        defaultSource={getAvatarSource(defaultAvatar, colorScheme)} // Default avatar before remote image loads
        style={[styles.base, styles[position ?? 'regular'], style]}
      />
    </View>
  );
};

const getAvatarSource = (avatar: string, color: ColorSchemeName) => {
  if (!avatar || avatar === '') {
    return null;
  }
  if (avatar.startsWith('https')) {
    return { uri: avatar };
  } else {
    return getImageSource(avatar, color);
  }
};

const getStyles = (theme: Theme, size: number) =>
  StyleSheet.create({
    container: {
      opacity: theme.iconOpacity,
    },
    base: {
      borderRadius: 8,
      height: size,
      width: size,
      marginBottom: 1,
    },
    left: {
      marginLeft: 7,
    },
    right: {
      marginLeft: 3,
    },
    regular: {},
  });

export default Avatar;
