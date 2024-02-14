// Chat.tsx

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { GiftedChat, IMessage, InputToolbar, MessageProps, InputToolbarProps, Send, Composer} from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Platform, Keyboard, TextStyle, SafeAreaView, Text, StyleSheet, ImageSourcePropType, useColorScheme } from 'react-native';
import { MessageUI } from '@/views/chat';
import emojiUtils from 'emoji-utils';
import { RootState, getAvatarSource } from '@/data';
import { User, Message, ChatInfo } from '@/data/types';
import { selectMessagesByChatId, getTopicByChatId, getLocalUser, addMessage } from '@/data/slices';
import { sendMessage } from '@/data/server';
import { useSelector, useDispatch } from 'react-redux';
import { Theme, useTheme } from '@/ui/theme';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';

type RenderMessageProps = MessageProps<IMessage>;
type RenderToolbarProps = InputToolbarProps<IMessage>;

export const chatOptions = (route: RouteProp<RootStackParamList, 'Chat'>, theme: Theme): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
    return ({
      title: `${route.params.topic}`,
  })};

const Chat: React.FC = () => {

  const theme = useTheme();
  const styles = getStyles(theme);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const chatInfo = route.params as ChatInfo;
  
  const topic = useSelector((state: RootState) => getTopicByChatId(state, chatInfo.chatid));
  const messages = useSelector((state: RootState) => selectMessagesByChatId(state, chatInfo.chatid));
  const user = useSelector((state: RootState) => getLocalUser(state));

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const localUser = {
    _id: user.userid,
    name: user.username,
    avatar: user.avatar,
  };
  
  const colorScheme = useColorScheme();

  const localMessages = useMemo(() => {
    return messages.map((msg: Message) => {

      let profiles = chatInfo.profiles || [];

      let sender = profiles.find((p) => p.userid == msg.sender) || { userid: '', username: '', avatar: '' };

      return {
        _id: msg.timestamp,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: sender.userid,
          name: sender.username,
          avatar: getAvatarSource(sender?.avatar || 'local://user.png', colorScheme),
        },
      };
    }).reverse();
  }, [messages, chatInfo.profiles, colorScheme]); // Only recompute if messages or profiles change


  useLayoutEffect(() => {
    navigation.setOptions({
      title: topic,
    });
  }, [navigation, topic]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const onSend = (newMessages: IMessage[] = []) => {
    let epochtime = newMessages[0].createdAt instanceof Date
    ? newMessages[0].createdAt.getTime()
    : newMessages[0].createdAt;

    let newMessage: Message = {
      chatid: chatInfo.chatid,
      content: newMessages[0].text,
      sender: user.userid,
      timestamp: epochtime,
    };

    dispatch(addMessage(newMessage));
    sendMessage(newMessage);
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

    return <MessageUI 
      {...props} 
      currentMessage={currentMessage}
      messageTextStyle={messageTextStyle} 
      user={localUser} 
      position={localUser._id == currentMessage?.user._id ? 'right' : 'left'}
    />;
  };

  const renderInputToolbar = (props: RenderToolbarProps) => {
    // Add your custom styles here
    const customInputToolbarStyles = getInputToolbarStyles(theme);
    const customSendButtonStyles = getSendButtonStyles(theme);

    return (
      <InputToolbar
        {...props}
        containerStyle={customInputToolbarStyles.container}
        renderComposer={(props) => {
          return (
            <Composer {...props} textInputStyle={customInputToolbarStyles.textStyle}/>
          );}}
        renderSend={(props) => {
          return (
            <Send {...props} containerStyle={customSendButtonStyles.container}>
              <Text style={customSendButtonStyles.text}>Send</Text>
            </Send>
          );
        }}
      />
    );
  }

  return (
    <SafeAreaView style={keyboardVisible ? styles.containerKeyboard : styles.container}>
      <GiftedChat
        messages={localMessages}
        onSend={onSend}
        user={localUser}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        alignTop={true}
        messagesContainerStyle={keyboardVisible ? styles.messagesContainerKeyboard : styles.messagesContainer}
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
    // backgroundColor: 'white',
  },
  messagesContainer: {
    // flex: 1
    paddingBottom: 20,
  },
  messagesContainerKeyboard: {
    // flex: 1
    paddingBottom: 0,
  },
});

const getInputToolbarStyles = (theme: Theme) => StyleSheet.create({
  container: {
    margin:15,
    backgroundColor: theme.colors.header,
    borderTopWidth: 1,
    borderColor: theme.colors.outline,
    borderTopColor: theme.colors.outline,
    // paddingTop: 8,
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius:30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    lineHeight: 21,
    // fontSize: 16,
    paddingRight: 10,
    paddingBottom: 2,
    color: theme.colors.text.primary,
  }
});

const getSendButtonStyles = (theme: Theme) =>  StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.text.primary, // iOS message send button color, change as needed
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent', // Ensure the background is transparent
    marginBottom: 0, // Adjust this as needed
    paddingRight: 20,
    paddingBottom: 7,
    paddingTop: 8
  },
});

export default Chat;
