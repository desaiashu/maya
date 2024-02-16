// Chat.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  GiftedChat,
  IMessage,
  MessageProps,
  InputToolbarProps,
  Send,
  Composer,
} from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import {
  Platform,
  Keyboard,
  TextStyle,
  Text,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  FlatList,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageUI, InputToolbar } from '@/views/chat';
import emojiUtils from 'emoji-utils';
import { State, defaultAvatar, getAvatarSource } from '@/data';
import { Message, ChatInfo } from '@/data/types';
import { server, getState } from '@/data';
import { Theme, useTheme } from '@/ui/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Button } from '@/ui/atoms';

type RenderMessageProps = MessageProps<IMessage>;
type RenderToolbarProps = InputToolbarProps<IMessage>;

export const chatOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  return {
    title: '',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <Button bare title="◁   " onPress={() => navigation.goBack()} />
    ),
  };
};

const Chat: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const route = useRoute();
  const chatInfo = route.params as ChatInfo;

  const { user, messages, addMessage } = getState((state: State) => ({
    user: state.currentUser,
    messages: state.selectMessagesByChatId(chatInfo.chatid),
    addMessage: state.addMessage,
  }));

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const localUser = {
    _id: user.userid,
    name: user.username,
    avatar: user.avatar,
  };

  const colorScheme = useColorScheme();

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    let epochtime =
      newMessages[0].createdAt instanceof Date
        ? newMessages[0].createdAt.getTime()
        : newMessages[0].createdAt;

    let newMessage: Message = {
      chatid: chatInfo.chatid,
      content: newMessages[0].text,
      sender: user.userid,
      timestamp: epochtime,
    };

    addMessage(newMessage);
    server.sendMessage(newMessage);
  };

  const renderMessage = (currentMessage: Message) => {
    if (!currentMessage) {
      return null;
    }

    const currText = currentMessage?.content;

    let messageTextStyle: TextStyle | undefined;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <MessageUI
        currentMessage={currentMessage}
        messageTextStyle={messageTextStyle}
        user={localUser}
        position={localUser._id === currentMessage?.sender ? 'right' : 'left'}
      />
    );
  };

  const renderInputToolbar = (props: RenderToolbarProps) => {
    // Add your custom styles here
    const customInputToolbarStyles = getInputToolbarStyles(theme);
    const customSendButtonStyles = getSendButtonStyles(theme);

    return (
      <InputToolbar
        {...props}
        containerStyle={customInputToolbarStyles.container}
        renderComposer={composerProps => {
          return (
            <Composer
              {...composerProps}
              textInputStyle={customInputToolbarStyles.textStyle}
            />
          );
        }}
        renderSend={sendProps => {
          return (
            <Send
              {...sendProps}
              containerStyle={customSendButtonStyles.container}
            >
              <Text style={customSendButtonStyles.text}>Send</Text>
            </Send>
          );
        }}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.container}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => renderMessage(item)}
          keyExtractor={item => item.timestamp.toString()}
        />
        <InputToolbar onSend={() => {}} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: theme.colors.background,
    // marginTop: -40,
    // paddingTop: 70,
  },
  containerKeyboard: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 20,
  },
  messagesContainerKeyboard: {
    paddingBottom: 0,
  },
});

export default Chat;
