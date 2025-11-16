import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { StyleSheet, View, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);

  const { isStreaming, chunks, stopStream } = useStream(
    (state: StreamState) => ({
      isStreaming: state.isStreaming[chatid || ''],
      chunks: state.streams[chatid || ''],
      stopStream: state.stopStream,
    }),
  );

  const theme = useTheme();
  const styles = getStyles(theme);

  const debouncedUpdateDraft = useMemo(
    () =>
      debounce((c: string, d: string) => {
        updateDraft(c, d);
      }, 300),
    [updateDraft],
  );

  useEffect(() => {
    chatid && debouncedUpdateDraft(chatid, text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, chatid]);

  const onSendPress = () => {
    onSend(text);
    setText('');
  };

  const onStopPress = () => {
    stopStream(chatid);
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: insets.bottom - (focused ? 24 : 0),
        },
      ]}
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isStreaming && chunks.chatid === chatid ? (
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
              disabled={chatid === '_'}
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
