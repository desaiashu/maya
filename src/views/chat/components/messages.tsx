import React, { forwardRef } from 'react';
import { FlatList, ViewStyle, StyleSheet } from 'react-native';
import { Stream, MessageUI } from '@/views/chat/components';
import { Message, Profile } from '@/data/types';
import { WEB } from '@/data';

interface MessageListProps {
  messages: Message[];
  profiles: Profile[];
  style?: ViewStyle;
  info?: boolean;
  chatid: string;
}

const MessageList = forwardRef<FlatList<any>, MessageListProps>(
  (props, ref) => {
    const { messages, profiles, style, chatid, info = false } = props;

    const styles = getStyles();

    const avatars: Record<string, string> = {};
    const usernames: Record<string, string> = {};
    for (let profile of profiles || []) {
      avatars[profile.userid] = profile.avatar;
      usernames[profile.userid] = profile.username;
    }

    const renderMessage = (
      current: Message,
      next?: Message,
      prev?: Message,
    ) => {
      if (current.chatid === 'stream') {
        return (
          <Stream
            prev={prev}
            avatars={avatars}
            usernames={usernames}
            chatid={chatid}
          />
        );
      } else {
        return (
          <MessageUI
            current={current}
            next={next}
            prev={prev}
            avatar={avatars[current.sender]}
            username={usernames[current.sender] || ''}
            profiles={profiles}
            info={info}
          />
        );
      }
    };

    return (
      /* Note: FlatList doesn't play well with KeyboardAvoidingView
        unless "inverted" and using messages.reverse().*/
      <FlatList
        data={WEB ? messages : messages.reverse()}
        renderItem={({ item, index }) => {
          const next = WEB ? messages[index + 1] : messages[index - 1];
          const prev = WEB ? messages[index - 1] : messages[index + 1];
          return renderMessage(item, next, prev);
        }}
        keyExtractor={item => item.timestamp.toString()}
        style={[styles.messagesContainer, style]}
        ref={ref}
        scrollIndicatorInsets={{ right: -3 }}
        inverted={WEB ? false : true}
      />
    );
  },
);

const getStyles = () =>
  StyleSheet.create({
    messagesContainer: {
      flex: 1,
      marginTop: -8,
      marginBottom: 0,
    },
  });

export default MessageList;
