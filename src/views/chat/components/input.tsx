import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Keyboard } from 'react-native';
import { Button } from '@/ui/atoms';
import { Theme, useTheme } from '@/ui/theme';
import { useStore, State, useStream, StreamState, ANDROID } from '@/data';

interface InputToolbarProps {
  onSend: (text: string) => void;
  chatid?: string;
  onLayout?: (event: any) => void;
  placeholder?: string;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  onSend,
  chatid,
  onLayout,
  placeholder = 'Type a message...', //'What...', //
}) => {
  const draft = useStore((state: State) =>
    chatid && chatid !== '_' ? state.drafts[chatid] || '' : '',
  );
  const updateDraft = useStore((state: State) => state.updateDraft);
  const [text, setText] = useState(draft);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { isStreaming, stopStream } = useStream((state: StreamState) => ({
    isStreaming: state.isStreaming,
    stopStream: state.stopStream,
  }));

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      ANDROID ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      ANDROID ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    chatid && updateDraft(chatid, text);
  }, [text, chatid, updateDraft]);

  const onSendPress = () => {
    onSend(text);
    setText('');
  };

  const onStopPress = () => {
    stopStream();
  };

  return (
    <View
      style={[styles.container, keyboardVisible && styles.keyboard]}
      onLayout={onLayout}
    >
      <View style={styles.primary}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          multiline={true}
          style={[theme.fonts.body, styles.textInput]}
          autoFocus={false}
          enablesReturnKeyAutomatically
          verticalAlign={'top'}
          cursorColor={theme.colors.text.secondary}
          selectionColor={theme.colors.text.secondary}
        />
        {isStreaming ? (
          <Button
            bare
            tag="h4"
            style={styles.stopContainer} // Update this with your stop button styles
            title="stop"
            onPress={onStopPress} // Update this with your stop function
          />
        ) : (
          text.length > 0 && (
            <Button
              bare
              tag="h4"
              style={styles.sendContainer}
              title="Send"
              onPress={onSendPress}
              disabled={chatid === 'new' ? true : false}
            />
          )
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      bottom: 0,
      left: 0,
      right: 0,
      margin: 15,
      marginTop: 0,
      marginBottom: ANDROID ? 15 : 30,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
      elevation: 2,
      backgroundColor: theme.colors.header,
      paddingLeft: 15,
      paddingTop: 0,
      borderRadius: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyboard: {
      marginBottom: ANDROID ? 35 : 15,
    },
    primary: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    stopContainer: {
      height: 44,
      justifyContent: 'center',
      marginRight: 13,
      marginBottom: 4,
    },
    sendContainer: {
      height: 44,
      justifyContent: 'center',
      marginRight: 13,
      marginBottom: 3,
    },
    sendButton: {
      color: theme.colors.text.primary,
    },
    textInput: {
      paddingRight: 5,
      paddingBottom: ANDROID ? 8 : 12,
      paddingTop: ANDROID ? 8 : 6,
      color: theme.colors.text.primary,
      //my styles above
      flex: 1,
      marginLeft: 10,
      marginTop: ANDROID ? 0 : 6,
      marginBottom: ANDROID ? 3 : 5,
    },
  });

export default InputToolbar;
