// Chat.tsx

import React, { useEffect, useState } from 'react';
import { GiftedChat, IMessage, MessageProps, User } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Platform, TextStyle, SafeAreaView } from 'react-native';
import Message from './components/message';
import emojiUtils from 'emoji-utils'

type RenderMessageProps = MessageProps<IMessage>;

const Chat: React.FC = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = route.params as { chatId: string };

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {

    console.log('yay');

    setMessages([
      {
        _id: 1,
        text: 'Hello developer!!!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://res.cloudinary.com/studiocollective/image/upload/v1687814110/Studio%20Collective/Live%20Album/10mb%20squares/Back_vpy3os.png',
        },
      },
      {
        _id: 2,
        text: 'Hi!!!',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Ashu',
          avatar: 'https://res.cloudinary.com/studiocollective/image/upload/v1687814110/Studio%20Collective/Live%20Album/10mb%20squares/Cover_aqklkg.png',
        },
      },
    ]);
  }, []); // The empty array means this effect runs once on component mount

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    console.log(messages);
  };

  const renderMessage = (props: RenderMessageProps) => {

    const { currentMessage } = props;
    const currText = currentMessage?.text;

    let messageTextStyle: TextStyle | undefined;
    let user: User = {
      _id: 1,
      name: "ashu",
      avatar: "https://res.cloudinary.com/studiocollective/image/upload/v1687814110/Studio%20Collective/Live%20Album/10mb%20squares/Cover_aqklkg.png"
    }

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return <Message {...props} 
              messageTextStyle={messageTextStyle} 
              user={user} 
              position= {user._id == currentMessage?.user._id ? 'left' : 'right'}
            />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'Ashu',
          avatar: 'https://res.cloudinary.com/studiocollective/image/upload/v1687814110/Studio%20Collective/Live%20Album/10mb%20squares/Cover_aqklkg.png',
        }}
        renderMessage={renderMessage}
        alignTop={true}
      />
    </SafeAreaView>
  );
};

export default Chat;
