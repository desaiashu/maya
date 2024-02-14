import CryptoJS from 'crypto-js';
import { ColorSchemeName } from 'react-native'

export function hashPhoneNumber(phoneNumber: string): string {
  const phoneHash = CryptoJS.SHA256(phoneNumber).toString(CryptoJS.enc.Hex);
  return phoneHash;
}

interface RequireConverter {
  [key: string]: {
    light: any,
    dark: any,
  }
};

const defaultAvatar = 'local://user.png';
export const localAvatars: RequireConverter = {
  'local://user.png': {
    light: require('%/avatars/light/user.png'),
    dark: require('%/avatars/dark/user.png'),
  },
  'local://einstein.png': {
    light: require('%/avatars/light/einstein.png'),
    dark: require('%/avatars/dark/einstein.png'),
  },
  'local://openai.png': {
    light: require('%/avatars/light/openai.png'),
    dark: require('%/avatars/dark/openai.png'),
  },
  'local://oracle.png': {
    light: require('%/avatars/light/oracle.png'),
    dark: require('%/avatars/dark/oracle.png'),
  }
};

const icons: RequireConverter = {
  compose: {
    light: require('%/icons/light/compose.png'),
    dark: require('%/icons/dark/compose.png'),
  },
  profile: {
    light: require('%/icons/light/profile.png'),
    dark: require('%/icons/dark/profile.png'),
  },
  close: {
    light: require('%/icons/light/close.png'),
    dark: require('%/icons/dark/close.png'),
  },
  edit: {
    light: require('%/icons/light/edit.png'),
    dark: require('%/icons/dark/edit.png'),
  }
};

export const getAvatarSource = (avatar: string, color: ColorSchemeName) => {
  if (!color) { return null; }
  if (avatar?.startsWith('https')) {
    return { uri: avatar };
  } else if (avatar?.startsWith('local')) {
    return localAvatars[avatar][color] || localAvatars[defaultAvatar][color];
  } else {
    return localAvatars[defaultAvatar][color];
  }
};

export const getDefaultAvatar = (theme: ColorSchemeName) => {
  return getAvatarSource(defaultAvatar, theme);
}

export const getIconSource = (icon: string, color: ColorSchemeName) => {
  if (!color) { return null; }
  return icons[icon][color];
};
