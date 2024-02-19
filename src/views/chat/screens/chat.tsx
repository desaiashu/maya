// Chat.tsx

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Platform,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation,
  Keyboard,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  server,
  State,
  useStore,
  useStream,
  StreamState,
  timestamp,
  dummyMessage,
  DEV_SCREEN,
} from '@/data';
import { Message, ChatInfo } from '@/data/types';
import { MessageUI, InputToolbar, Stream } from '@/views/chat/components';
import { Theme, useTheme } from '@/ui/theme';
import { Button } from '@/ui/atoms';

export const chatOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: '',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <Button
        bare
        title="◁   "
        style={styles.back}
        onPress={() => navigation.goBack()}
      />
    ),
  };
};

const Chat: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const route = useRoute();
  const [chatInfo, setChatInfo] = useState<ChatInfo>(route.params as ChatInfo);
  let scrollPosition = 0;
  const flatListRef = React.useRef<FlatList>(null);

  const isStreaming = useStream((state: StreamState) => state.isStreaming);
  const { messages, chats, user, addMessage } = useStore((state: State) => ({
    user: state.currentUser,
    chats: state.chats,
    addMessage: state.addMessage,
    messages: isStreaming
      ? [
          ...state.messages.filter(
            message => message.chatid === chatInfo.chatid,
          ),
          dummyMessage,
        ]
      : state.messages.filter(message => message.chatid === chatInfo.chatid),
  }));

  const avatars: Record<string, string> = {};
  const usernames: Record<string, string> = {};
  for (let profile of chatInfo.profiles || []) {
    avatars[profile.userid] = profile.avatar;
    usernames[profile.userid] = profile.username;
  }

  //Dev screen override won't have route params
  if (DEV_SCREEN) {
    setChatInfo(chats[0]);
  }

  // For new chats, the chatID will be 'new' and requires update
  // For existing chats, profile updates might come through
  useEffect(() => {
    const updatedChat = chats.find(c => c.created === chatInfo.created);
    console.log('finding');
    if (updatedChat) {
      setChatInfo(updatedChat);
      console.log('CHAT UPDATED');
    }
  }, [chats, chatInfo.created]);

  const onSend = (message: string) => {
    let newMessage: Message = {
      chatid: chatInfo.chatid,
      content: message,
      sender: user.userid,
      timestamp: timestamp(),
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    addMessage(newMessage);
    if (messages.length > 0) {
      flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
    }
    server.sendMessage(newMessage);
  };

  const renderMessage = (current: Message, next?: Message, prev?: Message) => {
    if (current.chatid === 'stream') {
      return <Stream prev={prev} avatars={avatars} usernames={usernames} />;
    } else {
      return (
        <MessageUI
          current={current}
          next={next}
          prev={prev}
          avatar={avatars[current.sender]}
          username={usernames[current.sender] || ''}
          position={user.userid === current.sender ? 'right' : 'left'}
        />
      );
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newScrollPosition = event.nativeEvent.contentOffset.y;
    if (newScrollPosition > scrollPosition) {
      Keyboard.dismiss();
    }
    scrollPosition = newScrollPosition;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.keyboardAvoid}
      >
        {/* Note: FlatList doesn't play well with KeyboardAvoidingView
        unless "inverted" and using messages.reverse().*/}
        <FlatList
          data={messages.reverse()}
          renderItem={({ item, index }) =>
            renderMessage(item, messages[index - 1], messages[index + 1])
          }
          keyExtractor={item => item.timestamp.toString()}
          style={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={handleScroll}
          ref={flatListRef}
          inverted
        />
        <InputToolbar onSend={onSend} chatid={chatInfo.chatid} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginTop: -8,
    marginBottom: 0,
  },
  back: {
    backgroundColor: theme.colors.background,
    padding: 10,
    paddingRight: 2,
    borderRadius: 20,
    shadowColor: theme.colors.outline,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
});

export default Chat;
