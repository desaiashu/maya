// Chat.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
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
  SafeAreaView,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { MessageUI } from '@/views/chat';
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
      backgroundColor: theme.colors.background,
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

  const localMessages = useMemo(() => {
    return messages
      .map((msg: Message) => {
        let profiles = chatInfo.profiles || [];

        let sender = profiles.find(p => p.userid === msg.sender) || {
          userid: '',
          username: '',
          avatar: defaultAvatar,
        };

        return {
          _id: msg.timestamp,
          text: msg.content,
          createdAt: new Date(msg.timestamp),
          user: {
            _id: sender.userid,
            name: sender.username,
            avatar: getAvatarSource(sender.avatar, colorScheme),
          },
        };
      })
      .reverse();
  }, [messages, chatInfo.profiles, colorScheme]); // Only recompute if messages or profiles change

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

  const renderMessage = (props: RenderMessageProps) => {
    const { currentMessage } = props;
    if (!currentMessage) {
      return null;
    }

    const currText = currentMessage?.text;

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
        {...props}
        currentMessage={currentMessage}
        messageTextStyle={messageTextStyle}
        user={localUser}
        position={localUser._id === currentMessage?.user._id ? 'right' : 'left'}
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
    <SafeAreaView
      style={keyboardVisible ? styles.containerKeyboard : styles.container}
    >
      <GiftedChat
        messages={localMessages}
        onSend={onSend}
        user={localUser}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        alignTop={true}
        messagesContainerStyle={
          keyboardVisible
            ? styles.messagesContainerKeyboard
            : styles.messagesContainer
        }
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    marginBottom: -25,
    backgroundColor: theme.colors.background,
  },
  containerKeyboard: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContainer: {
    paddingBottom: 20,
  },
  messagesContainerKeyboard: {
    paddingBottom: 0,
  },
});

const getInputToolbarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      margin: 15,
      backgroundColor: theme.colors.header,
      borderTopWidth: 1,
      borderColor: theme.colors.outline,
      borderTopColor: theme.colors.outline,
      paddingLeft: 15,
      borderWidth: 1,
      borderRadius: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      lineHeight: 21,
      paddingRight: 10,
      paddingBottom: 2,
      color: theme.colors.text.primary,
    },
  });

const getSendButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: theme.colors.text.primary,
      fontWeight: '600',
      fontSize: 17,
      marginBottom: 0,
      paddingRight: 20,
      paddingBottom: 7,
      paddingTop: 8,
    },
  });

export default Chat;
