import CryptoJS from 'crypto-js';

export function hashPhoneNumber(phoneNumber: string): string {
  const phoneHash = CryptoJS.SHA256(phoneNumber).toString(CryptoJS.enc.Hex);
  return phoneHash;
}

export const defaultAvatar = require('../../assets/avatars/user.png');

const localAvatars: { [key: string]: any } = {
  'local://user.png': require('../../assets/avatars/user.png'),
  'local://einstein.png': require('../../assets/avatars/einstein.png'),
  'local://openai.png': require('../../assets/avatars/openai.png'),
  'local://oracle.png': require('../../assets/avatars/oracle.png'),
  // Add other local avatars as needed
};
export const getAvatarSource = (avatar: string) => {
  if (avatar?.startsWith('https')) {
    return { uri: avatar };
  } else if (avatar?.startsWith('local')) {
    return localAvatars[avatar] || defaultAvatar;
  } else {
    return defaultAvatar;
  }
};