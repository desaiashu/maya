import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GiftedAvatar from './GiftedAvatar';
import { StylePropType, isSameUser, isSameDay } from './utils';

interface AvatarProps {
  renderAvatarOnTop: boolean;
  showAvatarForEveryMessage: boolean;
  position: 'left' | 'right';
  currentMessage: any;
  renderAvatar: any;
  previousMessage: any;
  nextMessage: any;
  imageStyle: StylePropType;
  containerStyle: StylePropType;
  onPressAvatar: (user: any) => void;
  onLongPressAvatar: (user: any) => void;
}

const styles = StyleSheet.create({
  left: {
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  },
  right: {
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  },
});

const Avatar: React.FC<AvatarProps> = props => {
  const {
    renderAvatarOnTop,
    showAvatarForEveryMessage,
    containerStyle,
    position,
    currentMessage,
    renderAvatar,
    previousMessage,
    nextMessage,
    imageStyle,
  } = props;

  const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
  const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';

  if (renderAvatar === null) {
    return null;
  }

  if (
    !showAvatarForEveryMessage &&
    currentMessage &&
    messageToCompare &&
    isSameUser(currentMessage, messageToCompare) &&
    isSameDay(currentMessage, messageToCompare)
  ) {
    return (
      <View
        style={[
          styles[position].container,
          containerStyle && containerStyle[position],
        ]}
      >
        <GiftedAvatar
          avatarStyle={[
            styles[position].image,
            imageStyle && imageStyle[position],
          ]}
        />
      </View>
    );
  }

  const renderAvatarComponent = () => {
    if (props.renderAvatar) {
      const { renderAvatar, ...avatarProps } = props;
      return props.renderAvatar(avatarProps);
    }
    if (props.currentMessage) {
      return (
        <GiftedAvatar
          avatarStyle={[
            styles[props.position].image,
            props.imageStyle && props.imageStyle[props.position],
          ]}
          user={props.currentMessage.user}
          onPress={() =>
            props.onPressAvatar &&
            props.onPressAvatar(props.currentMessage.user)
          }
          onLongPress={() =>
            props.onLongPressAvatar &&
            props.onLongPressAvatar(props.currentMessage.user)
          }
        />
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles[position].container,
        styles[position][computedStyle],
        containerStyle && containerStyle[position],
      ]}
    >
      {renderAvatarComponent()}
    </View>
  );
};

Avatar.defaultProps = {
  renderAvatarOnTop: false,
  showAvatarForEveryMessage: false,
  position: 'left',
  currentMessage: {
    user: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  onPressAvatar: () => {},
  onLongPressAvatar: () => {},
};

export default Avatar;
