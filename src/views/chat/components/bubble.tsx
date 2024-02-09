import React from 'react';
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

const { isSameUser, isSameDay } = utils;

interface BubbleProps {
  touchableProps?: object,
  onLongPress?: (context: any, message: any) => void,
  renderMessageImage?: (messageImageProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element,
  renderMessageText?: (messageTextProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element,
  renderCustomView?: (props: BubbleProps) => JSX.Element,
  renderTime?: (timeProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element,
  renderUsername?: (usernameProps: any) => JSX.Element,
  renderTicks?: (currentMessage: IMessage) => JSX.Element,
  currentMessage: IMessage,
  previousMessage: IMessage,
  nextMessage: IMessage,
  user: { _id: string | number },
  containerStyle?: StyleProp<ViewStyle>,
  wrapperStyle?: StyleProp<ViewStyle>,
  messageTextStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[],
  usernameStyle?: StyleProp<TextStyle>,
  tickStyle?: StyleProp<TextStyle>,
  containerToNextStyle?: StyleProp<ViewStyle>,
  containerToPreviousStyle?: StyleProp<ViewStyle>,
  position: 'left' | 'right',
}

interface ActionSheetContext {
  actionSheet: () => {
    showActionSheetWithOptions: (options: any, callback: (buttonIndex: number) => void) => void;
  };
}

class Bubble extends React.Component<BubbleProps> {

  // declare context: ActionSheetContext;

  onLongPress = () => {
    // const { onLongPress, currentMessage } = this.props;
    // if (onLongPress) {
    //   onLongPress(this.context, currentMessage);
    // } else if (currentMessage.text) {
    //   const options = ['Copy Text', 'Cancel'];
    //   const cancelButtonIndex = options.length - 1;
    //   this.context.actionSheet().showActionSheetWithOptions(
    //     {
    //       options,
    //       cancelButtonIndex,
    //     },
    //     (buttonIndex: number) => {
    //       if (buttonIndex === 0) {
    //         Clipboard.setString(currentMessage.text);
    //       }
    //     },
    //   );
    // }
  };

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        position,
        ...messageTextProps
      } = this.props
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [
              styles[position].standardFont,
              styles[position].slackMessageText,
              messageTextStyle,
            ],
            right: [
              styles[position].standardFont,
              styles[position].slackMessageText,
              messageTextStyle,
            ],
          }}
        />
      )
    }
    return null
  }

  renderMessageImage() {
    const { currentMessage, renderMessageImage, position } = this.props;
    if (currentMessage.image) {
      const { ...messageImageProps } = this.props;
      return (
          <MessageImage
            {...messageImageProps}
            imageStyle={[styles[position].slackImage]}
          />);
    }
    return null;
  }

  renderTicks() {
    const { currentMessage, position } = this.props
    if (currentMessage.user._id !== this.props.user._id) {
      return null
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles[position].headerItem, styles[position].tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles[position].standardFont, styles[position].tick, this.props.tickStyle]}
            >
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles[position].standardFont, styles[position].tick, this.props.tickStyle]}
            >
              ✓
            </Text>
          )}
        </View>
      )
    }
    return null
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name
    if (username) {
      const { containerStyle, wrapperStyle, position, ...usernameProps } = this.props
      return (
        <Text
          style={[
            styles[position].standardFont,
            styles[position].headerItem,
            styles[position].username,
            this.props.usernameStyle,
          ]}
        >
          {username}
        </Text>
      )
    }
    return null
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, position, ...timeProps } = this.props
      return (
        <Time
          {...timeProps}
          containerStyle={{ 
            left: [styles[position].timeContainer],
            right: [styles[position].timeContainer] 
          }}
          timeTextStyle={{
            left: [
              styles[position].standardFont,
              styles[position].headerItem,
              styles[position].time,
            ],
            right: [
              styles[position].standardFont,
              styles[position].headerItem,
              styles[position].time,
            ],
          }}
        />
      )
    }
    return null
  }

  render() {
    const { currentMessage, previousMessage, containerStyle, wrapperStyle, touchableProps, position } = this.props;
    const isSameThread = isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage);

    const messageHeader = isSameThread ? null : (
      <View style={styles[position].headerView}>

        {this.props.position === 'left' ? this.renderUsername() : null}
        {this.renderTime()}
        {this.props.position === 'right' ? this.renderUsername() : null}

        {/* {this.renderTicks()} */}
      </View>
    );

    return (
      <View>
      <View style={[styles[position].container, containerStyle]}>
      <View style={[styles[position].header, wrapperStyle]}>
        {messageHeader}
      </View>
      </View>
      <View style={[styles[position].container, containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityRole='text'
          {...touchableProps}
        >
          <View style={[styles[position].wrapper, wrapperStyle]}>
              {this.renderMessageImage()}
              {this.renderMessageText()}
          </View>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
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
      justifyContent: 'flex-end',
    },
    standardFont: {
      fontSize: 15,
    },
    slackMessageText: {
      marginLeft: 0,
      marginRight: 0,
    },
    username: {
      fontWeight: 'bold',
    },
    time: {
      textAlign: 'left',
      fontSize: 8,
      paddingBottom: 2,
      marginLeft: -2
    },
    timeContainer: {
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
    headerItem: {
      marginRight: 10,
    },
    headerView: {
      marginTop: Platform.OS === 'android' ? -2 : 0,
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    tick: {
      backgroundColor: 'transparent',
      color: 'white',
    },
    tickView: {
      flexDirection: 'row',
    },
    slackImage: {
      borderRadius: 3,
      marginLeft: 0,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 60,
      marginRight: 8,
    },
    header: {
      // marginLeft: 60,
      minHeight: 5,
      justifyContent: 'flex-end',
    },
    wrapper: {
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    standardFont: {
      fontSize: 15,
      textAlign: 'right',
    },
    slackMessageText: {
      marginLeft: 0,
      marginRight: 0,
      textAlign: 'left'
    },
    username: {
      fontWeight: 'bold',
      textAlign: 'right',
    },
    time: {
      textAlign: 'right',
      fontSize: 8,
      paddingBottom: 2,
      marginRight: -2
    },
    timeContainer: {
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
    headerItem: {
      marginLeft: 10,
    },
    headerView: {
      marginTop: Platform.OS === 'android' ? -2 : 0,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    tick: {
      backgroundColor: 'transparent',
      color: 'white',
    },
    tickView: {
      flexDirection: 'row',
    },
    slackImage: {
      borderRadius: 3,
      marginLeft: 0,
      marginRight: 0,
    },
  }),
  
};

export default Bubble;
