import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Message, Confidence } from '@/data/types';
import {
  Bubble,
  Day,
  ConfidenceBadge,
  Perspective,
} from '@/views/chat/components';
import { Avatar } from '@/ui/atoms';
import { isSameUser, isSameDay } from '@/data';
import { RootStackParamList } from '@/views/navigator';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AnnotationProps, DiscussionProps } from '@/views/chat';

interface MessageProps {
  current: Message;
  next?: Message;
  prev?: Message;
  avatar: string;
  username: string;
  position?: 'left' | 'right';
}

const MessageUI: React.FC<MessageProps> = props => {
  const { current, next, prev, avatar, username, position = 'left' } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const styles = getStyles();

  const hideAvatar = isSameUser(current, next) && isSameDay(current, next);
  const hideDay = isSameDay(current, prev);
  const hideHeader = isSameUser(current, prev) && isSameDay(current, prev);
  const swap = !isSameUser(current, next);
  const first = !prev;
  const final = !next;

  const c: Confidence = {
    chatid: '1',
    messageid: 1,
    evaluator: 'string',
    percent: 85,
  };

  const openAnnotation = () => {
    console.log('annotate');
    const p: AnnotationProps = {
      prompt: prev!,
      response: current,
      confidence: c,
    };
    navigation.navigate('Annotation', p);
  };

  const openDiscussion = () => {
    console.log('discuss');
    const p: DiscussionProps = {
      prompt: prev!,
      response: current,
    };
    navigation.navigate('Discussion', p);
  };

  const renderPerspective = () => {
    return username === 'maya' ? (
      <View style={styles.base.perspective}>
        <Perspective message={current} onPress={openDiscussion} />
      </View>
    ) : null;
  };

  const renderConfidence = () => {
    return username === 'maya' ? (
      <ConfidenceBadge confidence={c} onPress={openAnnotation} />
    ) : null;
  };

  const renderAvatar = () => {
    return (
      <View style={styles.base.avatarContainer}>
        {hideAvatar ? null : (
          <View style={styles.base.avatarAbsolute}>
            {renderConfidence()}
            <Avatar position={position} avatar={avatar} />
          </View>
        )}
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
        {position === 'left' && renderAvatar()}
        <Bubble
          message={current}
          username={hideHeader ? null : username}
          position={position}
        />
        {position === 'right' && renderAvatar()}
      </View>
      {renderPerspective()}
    </View>
  );
};

const getStyles = () => ({
  base: StyleSheet.create({
    messageContainer: {
      marginTop: 8,
      marginBottom: 20,
    },
    swap: {
      marginBottom: 30,
    },
    first: {
      marginTop: 50,
    },
    final: {
      marginBottom: 30,
    },
    avatarContainer: {
      width: 41,
      height: 0,
      overflow: 'visible',
    },
    avatarAbsolute: {
      position: 'absolute',
      bottom: 2,
    },
    perspective: {
      marginRight: 25,
    },
  }),
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 12,
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
