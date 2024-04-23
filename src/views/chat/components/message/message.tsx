import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Message, Confidence, Profile } from '@/data/types';
import {
  Bubble,
  Day,
  ConfidenceBadge,
  Perspective,
} from '@/views/chat/components';
import { Avatar, IconButton } from '@/ui/atoms';
import { isSameUser, isSameDay, State, useStore } from '@/data';
import { RootStackParamList } from '@/views/navigator';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AnnotationProps, DiscussionProps } from '@/views/chat';

interface MessageProps {
  current: Message;
  next?: Message;
  prev?: Message;
  avatar: string;
  username: string;
  profiles?: Profile[];
  position?: 'left' | 'right';
  stream?: boolean;
  info?: boolean;
}

const MessageUI: React.FC<MessageProps> = props => {
  const {
    current,
    next,
    prev,
    avatar,
    username,
    profiles = [],
    stream = false,
    info = false,
    position = 'left',
  } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const styles = getStyles();

  const hideAvatar = isSameUser(current, next) && isSameDay(current, next);
  const hideDay = isSameDay(current, prev);
  const hideHeader = isSameUser(current, prev) && isSameDay(current, prev);
  const swap = !isSameUser(current, next);
  const first = !prev;
  const final = !next;

  const showPerspective = username === 'maya' && !stream && !info;

  const { perspective } = useStore((state: State) => ({
    perspective: state.perspectives[current.timestamp],
  }));

  const [confidence, setConfidence] = useState<Confidence>();
  useEffect(() => {
    perspective && setConfidence(perspective.confidence);
  }, [perspective]);

  const openAnnotation = () => {
    console.log('annotate');
    const p: AnnotationProps = {
      prompt: prev!,
      response: current,
      confidence: confidence,
      profiles,
    };
    navigation.navigate('Annotation', p);
  };

  const openDiscussion = () => {
    console.log('discuss');
    const p: DiscussionProps = {
      prompt: prev!,
      response: current,
      profiles,
    };
    navigation.navigate('Discussion', p);
  };

  const thumbs = (direction: 'up' | 'down') => {
    console.log(direction);
  };

  const renderButtons = () => {
    return showPerspective ? (
      <View style={styles.base.buttons}>
        <View style={styles.base.thumbsRow}>
          <IconButton
            round
            shadow
            icon="thumbsdown"
            style={styles.base.thumbs}
            containerStyle={[
              styles.base.thumbsContainer,
              styles.base.thumbsDown,
            ]}
            onPress={() => thumbs('down')}
          />
          <IconButton
            round
            shadow
            icon="thumbsup"
            style={styles.base.thumbs}
            containerStyle={[styles.base.thumbsContainer, styles.base.thumbsUp]}
            onPress={() => thumbs('up')}
          />
        </View>
        <Perspective onPress={openDiscussion} />
      </View>
    ) : null;
  };

  const renderConfidence = () => {
    return showPerspective ? (
      <ConfidenceBadge confidence={confidence} onPress={openAnnotation} />
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
      {!hideDay && !info && <Day timestamp={current.timestamp} />}
      <View style={styles[position].container}>
        {position === 'left' && renderAvatar()}
        <Bubble
          message={current}
          username={hideHeader ? null : username}
          position={position}
        />
        {position === 'right' && renderAvatar()}
      </View>
      {renderButtons()}
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
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 20,
      marginLeft: 62,
    },
    thumbsRow: {
      flexDirection: 'row',
    },
    thumbs: {
      height: 17,
      width: 17,
    },
    thumbsContainer: {
      marginTop: 10,
      marginRight: 8,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      width: 28,
      height: 28,
    },
    thumbsDown: {
      paddingTop: 2,
      paddingLeft: 1,
    },
    thumbsUp: {
      paddingBottom: 2,
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
