import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Message } from '@/data/types';
import { Bubble, Avatar, Day } from '@/views/chat/components';
import { isSameUser, isSameDay } from '@/data';

interface MessageProps {
  current: Message;
  next?: Message;
  prev?: Message;
  avatar: string;
  username: string;
  position: 'left' | 'right';
}

const MessageUI: React.FC<MessageProps> = props => {
  const { current, next, prev, position, avatar, username } = props;

  const styles = getStyles();

  const hideAvatar = isSameUser(current, next) && isSameDay(current, next);
  const hideDay = isSameDay(current, prev);
  const hideHeader = isSameUser(current, prev) && isSameDay(current, prev);
  const swap = !isSameUser(current, next);
  const first = !prev;
  const final = !next;

  const renderAvatar = () => {
    return (
      <View style={styles.base.avatarContainer}>
        {hideAvatar ? null : <Avatar position={position} avatar={avatar} />}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.base.messageContainer,
        first && styles.base.first,
        swap && styles.base.swap,
        final && styles.base.final,
      ]}
    >
      {!hideDay && <Day timestamp={current.timestamp} />}
      <View style={styles[position].container}>
        {position === 'left' ? renderAvatar() : null}
        <Bubble
          message={current}
          username={hideHeader ? null : username}
          position={position}
        />
        {position === 'right' ? renderAvatar() : null}
      </View>
    </View>
  );
};

const getStyles = () => ({
  base: StyleSheet.create({
    messageContainer: {
      marginTop: 8,
    },
    swap: {
      marginBottom: 23,
    },
    first: {
      marginTop: 50,
    },
    final: {
      marginBottom: 30,
    },
    avatarContainer: {
      width: 46,
    },
  }),
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 9,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 9,
    },
  }),
});

export default MessageUI;
