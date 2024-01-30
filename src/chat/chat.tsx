// Chat.tsx

import React, { useEffect, useState } from 'react';
import { GiftedChat, IMessage, InputToolbar, MessageProps, User, InputToolbarProps, Send, Composer} from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Platform, TextStyle, SafeAreaView, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import Message from './components/message';
import emojiUtils from 'emoji-utils'
import { user, einstein, messageData} from './data'

type RenderMessageProps = MessageProps<IMessage>;
type RenderToolbarProps = InputToolbarProps<IMessage>;

const Chat: React.FC = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = route.params as { chatId: string };

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {

    let messages = [...messageData[chatId]];
    setMessages(messages,);
  }, []); // The empty array means this effect runs once on component mount

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
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

    return <Message {...props} 
              messageTextStyle={messageTextStyle} 
              user={user} 
              position={user._id == currentMessage?.user._id ? 'right' : 'left'}
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
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        alignTop={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
