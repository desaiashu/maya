import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Divider } from '@/ui/atoms';
import { Message, Profile } from '@/data/types';
import {
  State,
  useStore,
  threadid,
  server,
  dummyMessage,
  StreamState,
  useStream,
  timestamp,
  WEB,
  WEB_DESKTOP,
  WEB_MOBILE,
  ANDROID,
  analytics,
  prepAnimation,
  fastAnimation,
  logger,
} from '@/data';
import {
  MessageList,
  InputToolbar,
  Search,
  Related,
} from '@/views/chat/components';

export const discussionOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'discussion',
    headerTitle: '',
    presentation: 'card',
    headerShown: true,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="backarrow"
        onPress={() => {
          analytics.track('back_to_chat');
          navigation.goBack();
        }}
        containerStyle={styles.iconCloseContainer}
        style={styles.iconClose}
        round
        shadow
      />
    ),
  };
};

export interface DiscussionProps {
  prompt: Message;
  response: Message;
  profiles: Profile[];
}

const Discussion: React.FC = () => {
  const styles = getStyles(useTheme());

  const route = useRoute();
  const { prompt, response, profiles } = route.params as DiscussionProps;

  const messagesRef = React.useRef<FlatList>(null);

  const messageid = threadid(response.chatid, response.timestamp);

  const isStreaming = useStream((state: StreamState) => state.isStreaming);
  const { messages, user, addMessage } = useStore((state: State) => ({
    user: state.currentUser,
    addMessage: state.addMessage,
    messages: [
      // prompt,
      // response,
      ...(state.messages[messageid] || []),
      ...(isStreaming ? [dummyMessage] : []),
    ],
  }));

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        prepAnimation(fastAnimation);
        setKeyboardVisible(true); // or set whatever state you want
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        prepAnimation(fastAnimation);
        setKeyboardVisible(false); // or set whatever state you want
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  const perspectives: Message[] = messages;

  useEffect(() => {
    if (!WEB) {
      server.getPerspectives([prompt, response]);
      setTimeout(
        () => {
          if (messagesRef.current) {
            if (messages.length > 0) {
              messagesRef.current.scrollToIndex({
                index: messages.length - 1,
                animated: false,
              });
            }
          }
        },
        ANDROID ? 50 : 150,
      ); // Delay of 1 second
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const thread = threadid(response.chatid, response.timestamp);

  const { results, related } = useStore((state: State) => ({
    results: state.results[thread] || [],
    related: state.topics[thread] || [],
  }));

  // const [results, setResults] = useState<SearchResult[]>(
  //   perspective ? perspective.search : [],
  // );
  useEffect(() => {
    logger.info('updated search');
    if (results.length > 0) prepAnimation('spring');
    // setResults(results);
  }, [results]);

  // const [related, setRelated] = useState<RelatedTopic[]>(
  //   perspective ? perspective.related : [],
  // );
  useEffect(() => {
    logger.info('updated topics');
    if (related.length > 0) prepAnimation('spring');
    // perspective && setRelated(perspective.related);
  }, [related]);

  const sendMessage = (message: string) => {
    let newMessage: Message = {
      chatid: messageid,
      content: message,
      sender: user.userid,
      timestamp: timestamp(),
    };
    prepAnimation('spring');
    addMessage(newMessage);
    if (messages.length > 0) {
      messagesRef?.current?.scrollToIndex({ index: 0, animated: true });
    }
    server.sendMessage(newMessage);
  };

  const onSend = (message: string) => {
    sendMessage(message);
    analytics.track('send_message_perspective');
  };

  const onRelated = (topic: string) => {
    sendMessage(topic);
    analytics.track('tap_related');
    // Additional logic for handling the selected topic
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        {!keyboardVisible && (
          <>
            <View style={styles.header}>
              <Words tag="h2">{'Points of view'}</Words>
            </View>
            <View style={styles.search}>
              {/* <Words tag="body" style={styles.h2}>
            {'Web'}
          </Words> */}
              <Search results={results} />
            </View>
          </>
        )}
        {!WEB && !keyboardVisible && (
          <View style={styles.related}>
            {/* <Words tag="body" style={styles.h2}>
            {'Related'}
          </Words> */}
            <Related related={related} onSelect={onRelated} />
          </View>
        )}
        <Divider />
        <MessageList
          messages={perspectives}
          profiles={profiles}
          style={styles.messages}
          info
          chatid={messageid}
          ref={messagesRef}
        />

        {!WEB && <InputToolbar onSend={onSend} />}
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
    header: {
      alignItems: 'center',
      marginTop: WEB ? (WEB_DESKTOP ? 24 : 17) : ANDROID ? 14 : 7,
    },
    h2: {
      marginBottom: 0,
      color: theme.colors.outline,
      fontSize: 12,
    },
    search: {
      marginLeft: '5%',
      marginTop: WEB ? (WEB_DESKTOP ? 20 : 14) : 16,
      marginBottom: WEB_DESKTOP ? 10 : 0,
    },
    related: {
      marginTop: 5,
      marginLeft: '5%',
    },
    messages: {
      marginTop: 0,
    },
    save: {},
    iconCloseContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: ANDROID ? 2 : 1,
      paddingTop: ANDROID ? 2 : 1,
      paddingBottom: 1,
      paddingRight: 1,
      marginTop: WEB ? (WEB_DESKTOP ? 12 : -5) : 2,
      marginLeft: WEB_MOBILE ? 16 : -3,
      width: 35,
      height: 35,
    },
    iconClose: {
      width: 18,
      height: 18,
    },
  });

export default Discussion;
