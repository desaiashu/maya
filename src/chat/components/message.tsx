import React, { Component, ReactNode } from 'react'
import { View, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native'

import { Avatar, Day, utils, IMessage, User, LeftRightStyle, AvatarProps, BubbleProps, DayProps} from 'react-native-gifted-chat'
import Bubble from './bubble-simple'

const { isSameUser, isSameDay } = utils

interface MessageProps {
  renderAvatar?: (props: AvatarProps<IMessage>) => ReactNode,
  renderBubble?: (props: BubbleProps<IMessage>) => ReactNode,
  renderDay?: (props: DayProps<IMessage>) => ReactNode,
  currentMessage: IMessage,
  nextMessage: IMessage,
  previousMessage: IMessage,
  user: User,
  containerStyle: LeftRightStyle<ViewStyle>
  messageTextStyle?: StyleProp<TextStyle> | StyleProp<TextStyle>[];
  position: 'left' | 'right'
  inverted?: boolean
}

class Message extends Component<MessageProps> {
  static defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
  }

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props
    return {
      ...props,
      position: 'left' as 'left',
      isSameUser,
      isSameDay,
    }
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      return <Day {...dayProps} />
    }
    return null
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps()
    return <Bubble {...bubbleProps} />
  }

  renderAvatar = () => {
    let extraStyle
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 }
    }

    const avatarProps = this.getInnerComponentProps()
    return (
      <Avatar
        {...avatarProps}
        imageStyle={{
          left: [styles.slackAvatar, extraStyle],
        }}
      />
    )
  }

  render() {
    const {
      currentMessage,
      nextMessage,
      position,
      containerStyle,
    } = this.props

    const sameUser = isSameUser(currentMessage, nextMessage!)

    return (
      <View>
        {this.renderDay()}
        <View
          style={[
            styles[position].container,
            { marginBottom: sameUser ? 2 : 10 },
            !this.props.inverted && { marginBottom: 2 },
            containerStyle && containerStyle[position],
          ]}
        >
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    )
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
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
  }),
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 3,
  },
}

export default Message;