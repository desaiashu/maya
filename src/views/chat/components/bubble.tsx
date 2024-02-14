import React, { useContext } from 'react';
import {
  Clipboard,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { MessageImage, MessageText, Time, utils, IMessage, MessageProps } from 'react-native-gifted-chat';
import { GiftedChatContext, IGiftedChatContext, useChatContext } from 'react-native-gifted-chat/lib/GiftedChatContext';
import { Theme, useTheme } from '@/ui/theme';

const { isSameUser, isSameDay } = utils;

interface BubbleProps {
  touchableProps?: object,
  onLongPress?: (context: any, message: any) => void,
  renderMessageImage?: (messageImageProps: { textStyle?: StyleProp<TextStyle> }) => JSX.Element,
  renderMessageText?: (messageTextProps: { textStyle?: StyleProp<TextStyle>}) => JSX.Element,
  renderCustomView?: (props: BubbleProps) => JSX.Element,
  renderTime?: (timeProps: { textStyle?: StyleProp<TextStyle>}) => JSX.Element,
  renderUsername?: (usernameProps: any) => JSX.Element,
  renderTicks?: (currentMessage: IMessage) => JSX.Element,
  currentMessage: IMessage,
  previousMessage?: IMessage,
  nextMessage?: IMessage,
  user: { _id: string | number },
  containerStyle?: StyleProp<ViewStyle>,
  wrapperStyle?: StyleProp<ViewStyle>,
  messageTextStyle?: StyleProp<TextStyle>,
  usernameStyle?: StyleProp<TextStyle>,
  tickStyle?: StyleProp<TextStyle>,
  containerToNextStyle?: StyleProp<ViewStyle>,
  containerToPreviousStyle?: StyleProp<ViewStyle>,
  position: 'left' | 'right',
}

export const Bubble: React.FC<BubbleProps> = (props) => {
  const context = useContext(GiftedChatContext);
  const { currentMessage, previousMessage, containerStyle, wrapperStyle, touchableProps, position } = props;
  
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleLongPress = () => {
    const { onLongPress, currentMessage } = props;
    if (onLongPress) {
      onLongPress(context, currentMessage);
    } else if (currentMessage.text) {
      const options = ['Copy Text', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) => {
          if (buttonIndex === 0) {
            Clipboard.setString(currentMessage.text);
          }
        },
      );
    }
  };
  
  const renderMessageText = () => {
    if (props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        position,
        ...messageTextProps
      } = props
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [
              theme.fonts.small,
              styles.base.primaryText,
              styles.base.messageText,
              messageTextStyle,
            ],
            right: [
              theme.fonts.small,
              styles.base.primaryText,
              styles.base.messageText,
              messageTextStyle,
            ],
          }}
        />
      )
    }
    return null
  }
  
  const renderMessageImage = () => {
    const { currentMessage, renderMessageImage, position } = props;
    if (currentMessage.image) {
      const { ...messageImageProps } = props;
      return (
          <MessageImage
            {...messageImageProps}
            imageStyle={[styles.base.image]}
          />);
    }
    return null;
  }
  
  const renderTicks = () => {
    const { currentMessage, position } = props
    if (currentMessage.user._id !== props.user._id) {
      return null
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles[position].headerItem, styles.base.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[theme.fonts.small, styles.base.primaryText, styles.base.tick, props.tickStyle]}
            >
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[theme.fonts.small, styles.base.primaryText, styles.base.tick, props.tickStyle]}
            >
              ✓
            </Text>
          )}
        </View>
      )
    }
    return null
  }
  
  const renderUsername = () => {
    const username = props.currentMessage.user.name
    if (username) {
      const { containerStyle, wrapperStyle, position, ...usernameProps } = props
      return (
        <Text
          style={[
            theme.fonts.h4,
            styles.base.primaryText,
            styles[position].headerItem,
            styles[position].textAlign,
            props.usernameStyle,
          ]}
        >
          {username}
        </Text>
      )
    }
    return null
  }
  
  const renderTime = () => {
    if (props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, position, ...timeProps } = props
      return (
        <Time
          {...timeProps}
          containerStyle={{ 
            left: [styles.base.timeContainer],
            right: [styles.base.timeContainer] 
          }}
          timeTextStyle={{
            left: [
              theme.fonts.tiny,
              styles.base.altText,
              styles[position].headerItem,
              styles[position].time,
              styles[position].textAlign,
            ],
            right: [
              theme.fonts.tiny,
              styles.base.altText,
              styles[position].headerItem,
              styles[position].time,
              styles[position].textAlign,
            ],
          }}
        />
      )
    }
    return null
  }
  
  const isSameThread = isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage);

  const messageHeader = isSameThread ? null : (
      <View style={[
        styles.base.headerView,
        styles[position].headerView, 
        ]}>

      
      {props.position === 'left' ? renderUsername() : null}
      {renderTime()}
      {props.position === 'right' ? renderUsername() : null}

      {/* {this.renderTicks()} */}
      </View>
  );

  return (
      <View>
        <View style={[
          styles.base.container,
          styles[position].container, 
          containerStyle
          ]}>
          <View style={[
            styles.base.header,
            styles[position].header,
            wrapperStyle]}>
            {messageHeader}
          </View>
        </View>
        <View style={[
          styles.base.container,
          styles[position].container, 
          containerStyle
          ]}>
          <TouchableOpacity
              onLongPress={handleLongPress}
              accessibilityRole='text'
              {...touchableProps}
          >
            <View style={[styles[position].wrapper, wrapperStyle]}>
              {renderMessageImage()}
              {renderMessageText()}
            </View>
          </TouchableOpacity>
        </View>
      </View>
  );
}


const getStyles = (theme: Theme) => ({
  base: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    header: {
      justifyContent: 'flex-end',
    },
    primaryText: {
      color: theme.colors.text.primary,
    },
    altText: {
      color: theme.colors.text.secondary,
    },
    messageText: {
      marginLeft: 0,
      marginRight: 0,
    },
    image: {
      borderRadius: 3,
      marginLeft: 0,
      marginRight: 0,
    },
    timeContainer: {
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
    tick: {
      backgroundColor: 'transparent',
      color: 'white',
    },
    tickView: {
      flexDirection: 'row',
    },
    headerView: {
      marginTop: Platform.OS === 'android' ? -2 : 0,
      flexDirection: 'row',
    }
  }),
  left: StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 60,
    },
    wrapper: {
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    header: {
      marginRight: 60,
    },
    textAlign: {
      textAlign: 'left',
    },
    time: {
      paddingBottom: 0.5,
      marginLeft: -2
    },
    headerItem: {
      marginRight: 10,
    },
    headerView: {
      alignItems: 'baseline',
    },
  }),
  right: StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      marginLeft: 60,
      marginRight: 8,
    },
    wrapper: {
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    header: {
      // marginLeft: 60,
      minHeight: 5,
    },
    textAlign: {
      textAlign: 'right',
    },
    time: {
      paddingBottom: 2,
      marginRight: -2
    },
    headerItem: {
      marginLeft: 10,
    },
    headerView: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
  }),
  
});

export default Bubble;
