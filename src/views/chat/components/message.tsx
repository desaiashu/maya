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
import { Theme, useTheme } from '@/ui/theme';

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

  const styles = getStyles(useTheme());

  const { isSameUser } = utils;
  const sameUser = isSameUser(currentMessage, nextMessage!);

  const renderAvatar = () => {
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: [styles.base.avatar, styles[props.position].avatar],
          right: [styles.base.avatar, styles[props.position].avatar],
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
          !sameUser && styles.base.swap,
          !props.inverted && styles.base.propsInverted,
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

const getStyles = (theme: Theme) => ({
  base: StyleSheet.create({
    messageContainer: {
      marginTop: 8,
    },
    day: {
      marginTop: 0,
      marginBottom: 20,
      color: theme.colors.text.secondary,
    },
    propsInverted: {
      marginBottom: 2,
    },
    swap: {
      marginBottom: 40,
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: 3,
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
    avatar: {
      marginLeft: 8,
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
    avatar: {
      marginRight: 8,
    },
  }),
});

export default MessageUI;
