// import React from 'react';
// import {
//   Clipboard,
//   Platform,
//   StyleProp,
//   StyleSheet,
//   Text,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from 'react-native';
// import { MessageImage, MessageText, Time, utils, IMessage, MessageProps } from 'react-native-gifted-chat';

// const { isSameUser, isSameDay } = utils;

// interface BubbleProps {
//   touchableProps?: object;
//   onLongPress?: (context: any, message: any) => void;
//   renderMessageImage?: (messageImageProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element;
//   renderMessageText?: (messageTextProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element;
//   renderCustomView?: (props: BubbleProps) => JSX.Element;
//   renderTime?: (timeProps: { textStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[] }) => JSX.Element;
//   renderUsername?: (usernameProps: any) => JSX.Element;
//   renderTicks?: (currentMessage: IMessage) => JSX.Element;
//   currentMessage: IMessage;
//   previousMessage: IMessage;
//   nextMessage: IMessage;
//   user: { _id: string | number };
//   containerStyle?: StyleProp<ViewStyle>;
//   wrapperStyle?: StyleProp<ViewStyle>;
//   messageTextStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[];
//   usernameStyle?: StyleProp<TextStyle>;
//   tickStyle?: StyleProp<TextStyle>;
//   containerToNextStyle?: StyleProp<ViewStyle>;
//   containerToPreviousStyle?: StyleProp<ViewStyle>;
// }

// interface ActionSheetContext {
//   actionSheet: () => {
//     showActionSheetWithOptions: (options: any, callback: (buttonIndex: number) => void) => void;
//   };
// }

// class Bubble extends React.Component<BubbleProps> {

//   // declare context: ActionSheetContext;

//   onLongPress = () => {
//     // const { onLongPress, currentMessage } = this.props;
//     // if (onLongPress) {
//     //   onLongPress(this.context, currentMessage);
//     // } else if (currentMessage.text) {
//     //   const options = ['Copy Text', 'Cancel'];
//     //   const cancelButtonIndex = options.length - 1;
//     //   this.context.actionSheet().showActionSheetWithOptions(
//     //     {
//     //       options,
//     //       cancelButtonIndex,
//     //     },
//     //     (buttonIndex: number) => {
//     //       if (buttonIndex === 0) {
//     //         Clipboard.setString(currentMessage.text);
//     //       }
//     //     },
//     //   );
//     // }
//   };

//   renderMessageText() {
//     if (this.props.currentMessage.text) {
//       const {
//         containerStyle,
//         wrapperStyle,
//         messageTextStyle,
//         ...messageTextProps
//       } = this.props
//       return (
//         <MessageText
//           {...messageTextProps}
//           textStyle={{
//             left: [
//               styles.standardFont,
//               styles.slackMessageText,
//               messageTextStyle,
//             ],
//           }}
//         />
//       )
//     }
//     return null
//   }

//   renderMessageImage() {
//     const { currentMessage, renderMessageImage } = this.props;
//     if (currentMessage.image) {
//       const { ...messageImageProps } = this.props;
//       return (
//           <MessageImage
//             {...messageImageProps}
//             imageStyle={[styles.slackImage]}
//           />);
//     }
//     return null;
//   }

//   renderTicks() {
//     const { currentMessage } = this.props
//     if (this.props.renderTicks) {
//       return this.props.renderTicks(currentMessage)
//     }
//     if (currentMessage.user._id !== this.props.user._id) {
//       return null
//     }
//     if (currentMessage.sent || currentMessage.received) {
//       return (
//         <View style={[styles.headerItem, styles.tickView]}>
//           {currentMessage.sent && (
//             <Text
//               style={[styles.standardFont, styles.tick, this.props.tickStyle]}
//             >
//               ✓
//             </Text>
//           )}
//           {currentMessage.received && (
//             <Text
//               style={[styles.standardFont, styles.tick, this.props.tickStyle]}
//             >
//               ✓
//             </Text>
//           )}
//         </View>
//       )
//     }
//     return null
//   }

//   renderUsername() {
//     const username = this.props.currentMessage.user.name
//     if (username) {
//       const { containerStyle, wrapperStyle, ...usernameProps } = this.props
//       if (this.props.renderUsername) {
//         return this.props.renderUsername(usernameProps)
//       }
//       return (
//         <Text
//           style={[
//             styles.standardFont,
//             styles.headerItem,
//             styles.username,
//             this.props.usernameStyle,
//           ]}
//         >
//           {username}
//         </Text>
//       )
//     }
//     return null
//   }

//   renderTime() {
//     if (this.props.currentMessage.createdAt) {
//       const { containerStyle, wrapperStyle, ...timeProps } = this.props
//       return (
//         <Time
//           {...timeProps}
//           containerStyle={{ left: [styles.timeContainer] }}
//           timeTextStyle={{
//             left: [
//               styles.standardFont,
//               styles.headerItem,
//               styles.time,
//             ],
//           }}
//         />
//       )
//     }
//     return null
//   }

//   renderCustomView() {
//     if (this.props.renderCustomView) {
//       return this.props.renderCustomView(this.props)
//     }
//     return null
//   }

//   render() {
//     const { currentMessage, previousMessage, containerStyle, wrapperStyle, touchableProps } = this.props;
//     const isSameThread = isSameUser(currentMessage, previousMessage) &&
//       isSameDay(currentMessage, previousMessage);

//     const messageHeader = isSameThread ? null : (
//       <View style={styles.headerView}>
//         {this.renderUsername()}
//         {this.renderTime()}
//         {this.renderTicks()}
//       </View>
//     );

//     return (
//       <View style={[styles.container, containerStyle]}>
//         <TouchableOpacity
//           onLongPress={this.onLongPress}
//           accessibilityRole='text'
//           {...touchableProps}
//         >
//           <View style={[styles.wrapper, wrapperStyle]}>
//             <View>
//               {this.renderCustomView()}
//               {messageHeader}
//               {this.renderMessageImage()}
//               {this.renderMessageText()}
//             </View>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = {
//   left: StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//       justifyContent: 'flex-start',
//       marginLeft: 8,
//       marginRight: 0,
//     },
    
//   }),
//   right: StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//       justifyContent: 'flex-end',
//       marginLeft: 0,
//       marginRight: 8,
//     },
//   }),
//   standardFont: {
//     fontSize: 15,
//   },
//   slackMessageText: {
//     marginLeft: 0,
//     marginRight: 0,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   wrapper: {
//     marginRight: 60,
//     minHeight: 20,
//     justifyContent: 'flex-end',
//   },
//   username: {
//     fontWeight: 'bold',
//   },
//   time: {
//     textAlign: 'left',
//     fontSize: 12,
//   },
//   timeContainer: {
//     marginLeft: 0,
//     marginRight: 0,
//     marginBottom: 0,
//   },
//   headerItem: {
//     marginRight: 10,
//   },
//   headerView: {
//     marginTop: Platform.OS === 'android' ? -2 : 0,
//     flexDirection: 'row',
//     alignItems: 'baseline',
//   },
//   tick: {
//     backgroundColor: 'transparent',
//     color: 'white',
//   },
//   tickView: {
//     flexDirection: 'row',
//   },
//   slackImage: {
//     borderRadius: 3,
//     marginLeft: 0,
//     marginRight: 0,
//   },
// };

// export default Bubble;
