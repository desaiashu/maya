import CryptoJS from 'crypto-js';
import { ColorSchemeName } from 'react-native';
import { icons, botAvatars, humanAvatars } from '@/data';
import { Message } from '@/data/types';

export function hashPhoneNumber(phoneNumber: string): string {
  const phoneHash = CryptoJS.SHA256(phoneNumber).toString(CryptoJS.enc.Hex);
  return phoneHash;
}

export const defaultAvatar = 'local://user.png';

export const isSameDay = (
  message1: Message | undefined,
  message2: Message | undefined,
) => {
  if (!message1 || !message2) {
    return false;
  }
  const date1 = new Date(message1.timestamp);
  const date2 = new Date(message2.timestamp);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameUser = (
  message1: Message | undefined,
  message2: Message | undefined,
) => {
  if (!message1 || !message2) {
    return false;
  }
  return message1.sender === message2.sender;
};

export const getAvatarSource = (avatar: string, color: ColorSchemeName) => {
  if (!avatar || avatar === '') {
    return null;
  }
  if (avatar.startsWith('https')) {
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
