import CryptoJS from 'crypto-js';
import { ColorSchemeName } from 'react-native';
import { icons, botAvatars, humanAvatars } from '@/data';

export function hashPhoneNumber(phoneNumber: string): string {
  const phoneHash = CryptoJS.SHA256(phoneNumber).toString(CryptoJS.enc.Hex);
  return phoneHash;
}

const defaultAvatar = 'local://user.png';

export const getAvatarSource = (avatar: string, color: ColorSchemeName) => {
  if (avatar?.startsWith('https')) {
    return { uri: avatar };
  } else {
    return getImageSource(avatar, color);
  }
};

export const getDefaultAvatar = (theme: ColorSchemeName) => {
  return getAvatarSource(defaultAvatar, theme);
};

export const getImageSource = (image: string, color: ColorSchemeName) => {
  if (!color) {
    return null;
  }
  if (icons[image]) {
    return icons[image][color];
  } else if (botAvatars[image]) {
    return botAvatars[image][color];
  } else if (humanAvatars[image]) {
    return humanAvatars[image][color];
  } else {
    return humanAvatars[defaultAvatar][color];
  }
};
