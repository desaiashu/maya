// Chat.tsx

import React from 'react';
import { useRoute } from '@react-navigation/native';
import {
  Platform,
  KeyboardAvoidingView,
  FlatList,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageUI, InputToolbar, Stream } from '@/views/chat/components';
import { State, defaultAvatar } from '@/data';
import { Message, ChatInfo } from '@/data/types';
import { server, getState, timestamp } from '@/data';
import { Theme, useTheme } from '@/ui/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
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
  const chatInfo = route.params as ChatInfo;

  const flatListRef = React.useRef<FlatList>(null);

  const { user, messages, addMessage } = getState((state: State) => ({
    user: state.currentUser,
    messages: state.selectMessagesByChatId(chatInfo.chatid),
    addMessage: state.addMessage,
  }));

  const avatars: { [key: string]: string } = {};
  const usernames: { [key: string]: string } = {};
  for (let profile of chatInfo.profiles || []) {
    avatars[profile.userid] = profile.avatar;
    usernames[profile.userid] = profile.username;
  }

  const onSend = (message: string) => {
    let newMessage: Message = {
      chatid: chatInfo.chatid,
      content: message,
      sender: user.userid,
      timestamp: timestamp(),
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    addMessage(newMessage);
    flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
    server.sendMessage(newMessage);
  };

  const renderMessage = (current: Message, next?: Message, prev?: Message) => {
    if (!current || current.chatid !== chatInfo.chatid) {
      console.log('null');
      return null;
    }
    return (
      <MessageUI
        current={current}
        next={next}
        prev={prev}
        avatar={avatars[current.sender] || defaultAvatar}
        username={usernames[current.sender] || ''}
        position={user.userid === current.sender ? 'right' : 'left'}
      />
    );
  };

  const renderStream = () => {
    return (
      <Stream
        prev={messages[messages.length - 1]}
        avatars={avatars}
        usernames={usernames}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.keyboardAvoid}
      >
        {/* Note: FlatList doesn't play well with KeyboardAvoidingView
        unless "inverted". Alternately, could mimic Messages behavior 
        of scrolling to bottom of chat with this code:
        onLayout={() => flatListRef?.current?.scrollToEnd({ animated: true })*/}
        <FlatList
          data={messages.reverse()}
          renderItem={({ item, index }) =>
            renderMessage(item, messages[index - 1], messages[index + 1])
          }
          keyExtractor={item => item.timestamp.toString()}
          style={styles.messagesContainer}
          ref={flatListRef}
          inverted
          ListHeaderComponent={renderStream}
          //Header bc it's inverted lol
        />
        <InputToolbar onSend={onSend} />
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
