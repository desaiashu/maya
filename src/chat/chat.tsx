// Chat.tsx

import React, { useState } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

interface Props {
    chatId: string; // Assuming chatId is of type string
  }

const Chat : React.FC = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = route.params as { chatId: string };

  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1, // The sender's user ID (should be dynamic based on the logged-in user)
        }}
      />
    </SafeAreaView>
  );
};

export default Chat;