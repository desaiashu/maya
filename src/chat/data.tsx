import { User } from 'react-native-gifted-chat';

export const userAvatar = require('../assets/img/user.png');
export const einsteinAvatar = require('../assets/img/einstein.png');
export const gptAvatar = require('../assets/img/openai.png');


// Assuming you have a type for your chat data
export type ChatItemType = {
    chatId: string;
    title: string;
    avatar: number;
  };
  
  // Dummy data for chat items
export const chatData: ChatItemType[] = [
    { chatId: '1', title: 'einstein', avatar: einsteinAvatar },
    { chatId: '2', title: 'chatgpt', avatar: gptAvatar },
    // ... more chat items
  ];

export let user: User = {
    _id: 1,
    name: "ashu",
    avatar: userAvatar
  }
  
export let einstein: User = {
    _id: 2,
    name: "einstein",
    avatar: einsteinAvatar
  }

  export let chatGPT: User = {
    _id: 3,
    name: "chatgpt",
    avatar: gptAvatar
  }

export type MessageDataType = {
    _id: number,
    text: string,
    createdAt: Date,
    user: User;
  };

export let messageData: {[key: string]: MessageDataType[]} = 
    {
        '1': [{
            _id: 1,
            text: "Hi, I'm Einstein",
            createdAt: new Date(),
            user: einstein,
          },
          {
            _id: 2,
            text: 'Hi!!!',
            createdAt: new Date(),
            user: user,
          },
        ],
        '2': [
            {
                _id: 1,
                text: "Hi, I'm ChatGPT",
                createdAt: new Date(),
                user: chatGPT,
              },
              {
                _id: 2,
                text: 'Hi!!!',
                createdAt: new Date(),
                user: user,
              },
            ]
    }
  

