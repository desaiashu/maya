import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Message } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { Words } from '@/ui/atoms';
import { Time } from '@/views/chat/components/timestamp';

interface BubbleProps {
  onLongPress?: (context: any, message: any) => void;
  message: Message;
  position: 'left' | 'right';
  username: string | null;
}

export const Bubble: React.FC<BubbleProps> = props => {
  const { message, username, position } = props;

  const theme = useTheme();
  const styles = getStyles(theme);

  const { showActionSheetWithOptions } = useActionSheet();

  const handleLongPress = () => {
    const options = ['Copy Text', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (i?: number) => {
        if (i === 0) {
          Clipboard.setString(message.content);
        }
      },
    );
  };

  const renderMessageText = () => {
    return (
      <Words
        tag="body"
        style={[styles.base.primaryText, styles.base.messageText]}
      >
        {message.content}
      </Words>
    );
  };

  const renderUsername = () => {
    return (
      <Words
        tag="h4"
        style={[
          styles.base.primaryText,
          styles[position].headerItem,
          styles[position].textAlign,
        ]}
      >
        {username}
      </Words>
    );
  };

  const renderTime = () => {
    return <Time timestamp={message.timestamp} position={position} />;
  };

  const messageHeader = username && (
    <View style={styles.base.headerView}>
      {props.position === 'left' && renderUsername()}
      {renderTime()}
      {props.position === 'right' && renderUsername()}
    </View>
  );

  return (
    <View>
      <View style={[styles.base.container, styles[position].container]}>
        <View style={[styles.base.header, styles[position].header]}>
          {messageHeader}
        </View>
      </View>
      <View style={[styles.base.container, styles[position].container]}>
        <TouchableOpacity
          onLongPress={handleLongPress}
          activeOpacity={1}
          accessibilityRole="text"
        >
          {renderMessageText()}
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    headerView: {
      marginTop: Platform.OS === 'android' ? -2 : 0,
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 2,
    },
  }),
  left: StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 67, //47,
    },
    wrapper: {
      // marginRight: 30, //47,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    header: {
      marginRight: 60,
    },
    textAlign: {
      textAlign: 'left',
    },
    headerItem: {
      marginRight: 10,
    },
  }),
  right: StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      marginLeft: 55,
      marginRight: 8,
    },
    wrapper: {
      marginLeft: 55,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    header: {
      // minHeight: 5,
    },
    headerItem: {
      marginLeft: 10,
    },
    textAlign: {
      textAlign: 'right',
    },
  }),
});

export default Bubble;
