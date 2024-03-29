import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Platform, Keyboard } from 'react-native';
import { Button } from '@/ui/atoms';
import { Theme, useTheme } from '@/ui/theme';
import { useStore, State } from '@/data';

interface InputToolbarProps {
  onSend: (text: string) => void;
  chatid: string;
  onLayout?: (event: any) => void;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  onSend,
  chatid,
  onLayout,
}) => {
  const draft = useStore((state: State) => state.drafts[chatid] || '');
  const updateDraft = useStore((state: State) => state.updateDraft);
  const [text, setText] = useState(draft);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
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
    updateDraft(chatid, text);
  }, [text, chatid, updateDraft]);

  const onSendPress = () => {
    onSend(text);
    setText('');
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
          placeholder={'Type a message...'}
          placeholderTextColor={theme.colors.text.secondary}
          multiline={true}
          style={[theme.fonts.body, styles.textInput]}
          autoFocus={false}
          enablesReturnKeyAutomatically
          verticalAlign={'top'}
          cursorColor={theme.colors.text.secondary}
          selectionColor={theme.colors.text.secondary}
        />
        {text.length > 0 && (
          <Button
            bare
            tag="h4"
            style={styles.sendContainer}
            title="Send"
            onPress={onSendPress}
            disabled={chatid === 'new' ? true : false}
          />
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
      marginBottom: 30,
      shadowColor: theme.colors.outline,
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 1,
      backgroundColor: theme.colors.header,
      paddingLeft: 15,
      paddingTop: 0,
      borderRadius: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyboard: {
      marginBottom: 15,
      // marginTop: 10,
    },
    primary: {
      flexDirection: 'row',
      alignItems: 'flex-end',
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
      paddingBottom: 12,
      paddingTop: 6,
      color: theme.colors.text.primary,
      //my styles above
      flex: 1,
      marginLeft: 10,
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
