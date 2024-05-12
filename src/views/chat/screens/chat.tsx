// Chat.tsx

import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Platform,
  KeyboardAvoidingView,
  FlatList,
  View,
  StyleSheet,
  Share,
  Linking,
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
  WEB,
  WEB_DESKTOP,
  newCommunityChat,
  hashChatID,
  WEB_URL,
  DOWNLOAD_URL,
  emptyChat,
  analytics,
  prepAnimation,
} from '@/data';
import { useNavigation } from '@react-navigation/native';
import { Message, ChatInfo } from '@/data/types';
import { MessageList, InputToolbar } from '@/views/chat/components';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Button } from '@/ui/atoms';
import { useParams } from 'react-router-dom';

interface chatOptionsProps {
  navigation: DrawerNavigationProp<RootStackParamList, 'Chat'>;
  theme: Theme;
  chat: ChatInfo | undefined;
}

export const chatOptions = (
  props: chatOptionsProps,
): DrawerNavigationOptions => {
  const { navigation, theme, chat } = props;
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
        onPress={() => {
          analytics.track('open_drawer');
          navigation.toggleDrawer();
        }}
        containerStyle={styles.iconMenuContainer}
        style={styles.iconMenu}
        round
        shadow
      />
    ),
    headerRight: () => renderRightMenu(props),
  };
};

const renderRightMenu = (props: chatOptionsProps) => {
  const { navigation, theme, chat } = props;
  const styles = getStyles(theme);

  const renderShare = () => {
    return (
      chat && (
        <IconButton
          icon="share"
          onPress={() => {
            Share.share({
              url: WEB_URL + hashChatID(chat.chatid),
              title: 'Maya Chat',
            });
            analytics.track('share_chat');
          }}
          containerStyle={styles.iconShareContainer}
          style={styles.iconShare}
          round
          shadow
        />
      )
    );
  };

  return (
    <View style={styles.rightMenu}>
      {chat && renderShare()}
      <IconButton
        icon="compose"
        onPress={() => {
          analytics.track('new_chat');
          const newChat = newCommunityChat();
          navigation.reset({
            index: 0,
            routes: [{ name: newChat.chatid + newChat.topic, params: newChat }],
          });
        }}
        containerStyle={styles.iconComposeContainer}
        style={styles.iconCompose}
        round
        shadow
      />
    </View>
  );
};

const Chat: React.FC = () => {
  const params = useParams();

  const navigation =
    useNavigation<DrawerNavigationProp<RootStackParamList, 'Chat'>>();
  const theme = useTheme();
  const styles = getStyles(theme);
  const route = useRoute();

  let [chatInfo, setChatInfo] = useState<ChatInfo>(
    WEB ? emptyChat() : (route.params as ChatInfo),
  );

  useEffect(() => {
    if (WEB && params.slug) {
      server.getSlug(params.slug);
      analytics.track('visit_chat_page', { slug: params.slug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // let scrollPosition = 0;
  const flatListRef = React.useRef<FlatList>(null);

  const chats = useStore((state: State) => state.chats);

  //Dev screen override won't have route params
  if (DEV_SCREEN) chatInfo = chats[0]; //Setting directly to execute before next 2 commands

  const isStreaming = useStream((state: StreamState) => state.isStreaming);
  const { messages, user, addMessage } = useStore((state: State) => ({
    user: state.currentUser,
    addMessage: state.addMessage,
    messages: [
      ...state.messages.filter(message => message.chatid === chatInfo.chatid),
      ...(isStreaming ? [dummyMessage] : []),
    ],
  }));

  // For new chats, the chatID will be 'new' and requires update
  // For existing chats, profile updates might come through
  useEffect(() => {
    if (WEB) {
      const updatedChat = chats.find(c => c.slug === params.slug);
      if (updatedChat) setChatInfo(updatedChat);
      analytics.track('loaded_chat', { slug: params.slug });
    } else {
      const updatedChat = chats.find(c => c.created === chatInfo.created);
      if (updatedChat) {
        setChatInfo(updatedChat);
        navigation.setOptions({
          headerRight: () =>
            renderRightMenu({ navigation, theme, chat: updatedChat }),
          // You can set other header options here based on chatInfo
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, chatInfo.created]);

  const onSend = (message: string) => {
    let newMessage: Message = {
      chatid: chatInfo.chatid,
      content: message,
      sender: user.userid,
      timestamp: timestamp(),
    };
    prepAnimation('spring');
    addMessage(newMessage);
    if (messages.length > 0) {
      flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
    }
    server.sendMessage(newMessage);
    analytics.track('send_message');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        {WEB && (
          <Button
            title="Download beta"
            tag="h4"
            onPress={() => {
              Linking.openURL(DOWNLOAD_URL);
              analytics.track('chat_download_clicked');
            }}
            style={styles.download}
            outlined
          />
        )}
        <MessageList
          messages={messages}
          profiles={chatInfo.profiles || []}
          ref={flatListRef}
          chatid={chatInfo.chatid}
        />
        {!WEB && <InputToolbar onSend={onSend} chatid={chatInfo.chatid} />}
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
    rightMenu: {
      flexDirection: 'row',
    },
    download: {
      marginTop: WEB_DESKTOP ? 25 : 0,
      marginBottom: WEB_DESKTOP ? 20 : 0,
      width: 200,
      alignSelf: 'center',
      textAlign: 'center',
    },
    iconMenuContainer: {
      paddingLeft: 9,
      paddingTop: 9,
      paddingBottom: 9,
      paddingRight: 9,
      marginLeft: 15,
    },
    iconMenu: {
      width: 18,
      height: 18,
    },
    iconShareContainer: {
      paddingLeft: 8,
      paddingTop: 11,
      paddingBottom: 7,
      paddingRight: 10,
      marginRight: 14,
    },
    iconShare: {
      width: 18,
      height: 18,
    },
    iconComposeContainer: {
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
