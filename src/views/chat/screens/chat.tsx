// Chat.tsx

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Platform,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation,
  View,
  StyleSheet,
} from 'react-native';
import {
  DrawerNavigationProp,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
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
  newCommunityChat,
} from '@/data';
import { Message, ChatInfo } from '@/data/types';
import { MessageUI, InputToolbar, Stream } from '@/views/chat/components';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton } from '@/ui/atoms';

export const chatOptions = (
  navigation: DrawerNavigationProp<RootStackParamList, 'Chat'>,
  theme: Theme,
  chat: ChatInfo | undefined,
): DrawerNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: chat ? chat.chatid : 'new chat',
    headerTitle: '',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="menu"
        onPress={() => navigation.toggleDrawer()}
        containerStyle={styles.iconMenuContainer}
        style={styles.iconMenu}
      />
    ),
    headerRight: () => (
      <View style={styles.rightMenu}>
        <IconButton
          icon="share"
          onPress={() => {}}
          containerStyle={styles.iconShareContainer}
          style={styles.iconShare}
        />
        <IconButton
          icon="compose"
          onPress={() => {
            const newChat = newCommunityChat();
            navigation.reset({
              index: 0,
              routes: [
                { name: newChat.chatid + newChat.topic, params: newChat },
              ],
            });
          }}
          containerStyle={styles.iconComposeContainer}
          style={styles.iconCompose}
        />
      </View>
    ),
  };
};

const Chat: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const route = useRoute();

  let [chatInfo, setChatInfo] = useState<ChatInfo>(route.params as ChatInfo);
  // let scrollPosition = 0;
  const flatListRef = React.useRef<FlatList>(null);

  const chats = useStore((state: State) => state.chats);
  //Dev screen override won't have route params
  if (DEV_SCREEN) {
    chatInfo = chats[0]; //Setting directly to execute before next 2 commands
  }

  const isStreaming = useStream((state: StreamState) => state.isStreaming);
  const { messages, user, addMessage } = useStore((state: State) => ({
    user: state.currentUser,
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

  // For new chats, the chatID will be 'new' and requires update
  // For existing chats, profile updates might come through
  useEffect(() => {
    const updatedChat = chats.find(c => c.created === chatInfo.created);
    if (updatedChat) {
      setChatInfo(updatedChat);
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
          position={'left'} //user.userid === current.sender ? 'right' : 'left'}
        />
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
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
          ref={flatListRef}
          scrollIndicatorInsets={{ right: -3 }}
          inverted
        />
        <InputToolbar onSend={onSend} chatid={chatInfo.chatid} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
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
    rightMenu: {
      flexDirection: 'row',
    },
    back: {
      backgroundColor: theme.colors.background,
      paddingLeft: 12,
      paddingTop: 8,
      paddingBottom: 8,
      paddingRight: 3,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
      fontWeight: 'bold',
    },
    iconMenuContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 9,
      paddingTop: 9,
      paddingBottom: 9,
      paddingRight: 9,
      marginLeft: 15,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    iconMenu: {
      width: 18,
      height: 18,
    },
    iconShareContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 8,
      paddingTop: 11,
      paddingBottom: 7,
      paddingRight: 10,
      marginRight: 14,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    iconShare: {
      width: 18,
      height: 18,
    },
    iconComposeContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 9,
      paddingTop: 9,
      paddingBottom: 9,
      paddingRight: 9,
      marginRight: 14,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
    },
    iconCompose: {
      width: 20,
      height: 20,
    },
  });

export default Chat;
