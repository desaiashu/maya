// Chat.tsx

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { GiftedChat, IMessage, InputToolbar, MessageProps, InputToolbarProps, Send, Composer} from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Platform, Keyboard, TextStyle, SafeAreaView, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import MessageUI from '../components/message';
import emojiUtils from 'emoji-utils';
import { User, Message, ChatInfo, RootState, selectMessagesByChatId, getTopicByChatId, getLocalUser, addMessage, sendMessage } from '../../../data';
import { useSelector, useDispatch } from 'react-redux';
import { getAvatarSource } from '../../../data/data/funx';


type RenderMessageProps = MessageProps<IMessage>;
type RenderToolbarProps = InputToolbarProps<IMessage>;

const Chat: React.FC = () => {

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
  
  const localMessages = useMemo(() => {
    return messages.map((msg: Message) => {

      console.log("profiles");
      console.log(chatInfo.profiles);
      let profiles = chatInfo.profiles || [];
      console.log("msg");
      console.log(msg);
      let sender = profiles.find((p) => p.userid == msg.sender) || { userid: '', username: '', avatar: '' };

      console.log("sender")
      console.log(sender)

      return {
        _id: msg.timestamp,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: sender.userid,
          name: sender.username,
          avatar: getAvatarSource(sender?.avatar || 'local://user.png'),
        },
      };
    }).reverse();
  }, [messages, chatInfo.profiles]); // Only recompute if messages or profiles change


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

    return <MessageUI {...props} 
              messageTextStyle={messageTextStyle} 
              user={localUser} 
              position={localUser._id == currentMessage?.user._id ? 'right' : 'left'}
            />;
  };

  const renderInputToolbar = (props: RenderToolbarProps) => {
    // Add your custom styles here

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -25,
    // backgroundColor: 'white',
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

const customInputToolbarStyles = StyleSheet.create({
  container: {
    margin:15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee',
    borderTopColor: '#eee',
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
  }
});

const customSendButtonStyles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000', // iOS message send button color, change as needed
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
