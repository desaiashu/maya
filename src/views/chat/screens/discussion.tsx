import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Divider } from '@/ui/atoms';
import { Message, Profile, SearchResult, RelatedTopic } from '@/data/types';
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
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconCloseContainer}
        style={styles.iconClose}
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
      ...state.messages.filter(message => message.chatid === messageid),
      ...(isStreaming ? [dummyMessage] : []),
    ],
  }));

  const perspectives: Message[] = messages;

  useEffect(() => {
    server.getPerspectives([prompt, response]);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { perspective } = useStore((state: State) => ({
    perspective:
      state.perspectives[threadid(response.chatid, response.timestamp)],
  }));

  const [results, setResults] = useState<SearchResult[]>(
    perspective ? perspective.searchResults : [],
  );
  useEffect(() => {
    console.log('updated search');
    if (perspective && perspective.searchResults.length > 0)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    perspective && setResults(perspective.searchResults);
  }, [perspective]);

  const [related, setRelated] = useState<RelatedTopic[]>(
    perspective ? perspective.relatedTopics : [],
  );
  useEffect(() => {
    console.log('updated topics');
    if (perspective && perspective.relatedTopics.length > 0)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    perspective && setRelated(perspective.relatedTopics);
  }, [perspective]);

  const sendMessage = (message: string) => {
    let newMessage: Message = {
      chatid: messageid,
      content: message,
      sender: user.userid,
      timestamp: timestamp(),
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    addMessage(newMessage);
    if (messages.length > 0) {
      messagesRef?.current?.scrollToIndex({ index: 0, animated: true });
    }
    server.sendMessage(newMessage);
  };

  const onSend = (message: string) => {
    sendMessage(message);
  };

  const onRelated = (topic: string) => {
    console.log(topic);
    sendMessage(topic);
    // Additional logic for handling the selected topic
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Words tag="h2">{'Points of view'}</Words>
        </View>
        <View style={styles.search}>
          {/* <Words tag="body" style={styles.h2}>
            {'Web'}
          </Words> */}
          <Search results={results} />
        </View>
        <View style={styles.related}>
          {/* <Words tag="body" style={styles.h2}>
            {'Related'}
          </Words> */}
          <Related related={related} onSelect={onRelated} />
        </View>
        <Divider />
        <MessageList
          messages={perspectives}
          profiles={profiles}
          style={styles.messages}
          info
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
      marginTop: 8,
    },
    h2: {
      marginBottom: 0,
      color: theme.colors.outline,
      fontSize: 12,
    },
    search: {
      marginLeft: '5%',
      marginTop: 20,
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
      paddingLeft: 1,
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 1,
      marginTop: 5,
      marginLeft: -3,
      borderRadius: 20,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
      width: 35,
      height: 35,
    },
    iconClose: {
      width: 18,
      height: 18,
    },
  });

export default Discussion;
