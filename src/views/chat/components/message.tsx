import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import {
  Avatar,
  Day,
  utils,
  IMessage,
  User,
  LeftRightStyle,
  AvatarProps,
  BubbleProps,
  DayProps,
} from 'react-native-gifted-chat';
import { Bubble } from '@/views/chat';

interface MessageProps {
  renderAvatar?: (props: AvatarProps<IMessage>) => ReactNode;
  renderBubble?: (props: BubbleProps<IMessage>) => ReactNode;
  renderDay?: (props: DayProps<IMessage>) => ReactNode;
  currentMessage: IMessage;
  nextMessage?: IMessage;
  previousMessage?: IMessage;
  user: User;
  containerStyle?: LeftRightStyle<ViewStyle>;
  messageTextStyle?: StyleProp<TextStyle>;
  position: 'left' | 'right';
  inverted?: boolean;
}

const MessageUI: React.FC<MessageProps> = props => {
  const { currentMessage, nextMessage, position, containerStyle } = props;

  const styles = getStyles();

  const { isSameUser } = utils;
  const sameUser = isSameUser(currentMessage, nextMessage!);

  const renderAvatar = () => {
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: [styles[props.position].slackAvatar],
          right: [styles[props.position].slackAvatar],
        }}
      />
    );
  };

  return (
    <View style={styles.base.messageContainer}>
      {props.currentMessage.createdAt && (
        <Day {...props} containerStyle={styles.base.day} />
      )}
      <View
        style={[
          styles[position].container,
          { marginBottom: sameUser ? 0 : 10 },
          !props.inverted && { marginBottom: 2 },
          containerStyle && containerStyle[position],
        ]}
      >
        {props.position === 'left' ? renderAvatar() : null}
        <Bubble {...props} containerStyle={{}} />
        {props.position === 'right' ? renderAvatar() : null}
      </View>
    </View>
  );
};

const getStyles = () => ({
  base: StyleSheet.create({
    messageContainer: {
      marginTop: 20,
    },
    day: {
      marginTop: 15,
      marginBottom: 20,
    },
  }),
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
    slackAvatar: {
      // The bottom should roughly line up with the first line of message text.
      height: 40,
      width: 40,
      borderRadius: 3,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
    slackAvatar: {
      // The bottom should roughly line up with the first line of message text.
      height: 40,
      width: 40,
      borderRadius: 3,
    },
  }),
});

export default MessageUI;
