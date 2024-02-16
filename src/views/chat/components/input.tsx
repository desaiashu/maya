import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Button } from '@/ui/atoms';
import { Theme, useTheme } from '@/ui/theme';

interface InputToolbarProps {
  onSend: (text: string) => void;
}

const InputToolbar: React.FC<InputToolbarProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const styles = getStyles(useTheme());

  return (
    <View style={[styles.container]}>
      <View style={[styles.primary]}>
        <TextInput
          accessible
          multiline={true}
          style={[styles.textInput]}
          autoFocus={false}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          onChangeText={setText}
        />
        <Button
          bare
          tag="h4"
          style={styles.sendContainer}
          title="Send"
          onPress={() => {
            onSend(text);
          }}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      // borderTopColor: Color.defaultColor,
      marginBottom: 30,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 15,
      backgroundColor: theme.colors.header,
      borderTopWidth: 1,
      borderColor: theme.colors.outline,
      borderTopColor: theme.colors.outline,
      paddingLeft: 15,
      borderWidth: 1,
      borderRadius: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    sendContainer: {
      height: 44,
      // justifyContent: 'flex-end',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    sendButton: {
      // color: Color.defaultBlue,
      // backgroundColor: Color.backgroundTransparent,
      // marginBottom: 12,
      marginLeft: 10,
      marginRight: 10,
      color: theme.colors.text.primary,
      // fontWeight: '600',
      // fontSize: 17,
      marginBottom: 12,
      paddingRight: 20,
      paddingBottom: 7,
      paddingTop: 8,
    },
    textInput: {
      lineHeight: 21,
      paddingRight: 10,
      paddingBottom: 2,
      color: theme.colors.text.primary,
      //my styles above
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      // lineHeight: 16,
      ...Platform.select({
        web: {
          paddingTop: 6,
          paddingLeft: 4,
        },
      }),
      marginTop: Platform.select({
        ios: 6,
        android: 0,
        web: 6,
      }),
      marginBottom: Platform.select({
        ios: 5,
        android: 3,
        web: 4,
      }),
    },
  });

export default InputToolbar;
