import CryptoJS from 'crypto-js';
import { ColorSchemeName, LayoutAnimation, Platform } from 'react-native';
import { icons, botAvatars, humanAvatars, useStore, server } from '@/data';
import { Message, Chunk, ChatInfo, PerspectiveData } from '@/data/types';

export function hashPhoneNumber(phoneNumber: string): string {
  const phoneHash = CryptoJS.SHA256(phoneNumber).toString(CryptoJS.enc.Hex);
  return phoneHash;
}

export function hashChatID(chatid: string): string {
  const chatHash = CryptoJS.SHA256(chatid).toString(CryptoJS.enc.Base64url);
  return chatHash.substring(0, 10);
}

export const timestamp = () => new Date().getTime();

export const threadid = (chatid: string, messid: number) =>
  chatid + '_' + messid.toString();

export const emptyChat = (): ChatInfo => {
  const state = useStore.getState();
  const userid = state.currentUser.userid;
  return {
    chatid: '_',
    slug: '_',
    creator: userid,
    participants: [userid, 'maya', 'system', 'uncensored', 'oracle'],
    topic: 'new chat',
    protocol: 'maya',
    profiles: [],
    created: timestamp(),
    updated: timestamp(),
  };
};

export const emptyPerspective = (): PerspectiveData => {
  return {
    messageid: 0,
    chatid: '',
    lastupdated: 0,
    confidence: undefined,
    related: [],
    search: [],
  };
};

export const newCommunityChat = () => {
  const state = useStore.getState();
  const lastChat = state.chats[0];

  if (lastChat && lastChat.topic === 'new chat') {
    return lastChat;
  } else {
    const chat: ChatInfo = emptyChat();
    server.createChat(chat);
    return chat;
  }
};

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
    return null;
  }
};

export const messageFromChunk = (chunk: Chunk): Message => {
  const message: Message = {
    chatid: chunk.chatid,
    content: chunk.content,
    sender: chunk.sender,
    timestamp: chunk.timestamp,
  };
  return message;
};

export const cancelLayoutAnimation = () => {
  if (Platform.OS === 'android') {
    // For Android, use a supported animation type or disable animation
    LayoutAnimation.configureNext({ duration: 0 });
  } else {
    LayoutAnimation.configureNext({
      duration: 0,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  }
};
