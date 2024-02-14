import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/views/navigator';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';

export const newChatOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'NewChat'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'new chat',
    presentation: 'modal',
    headerLeft: () => (
      <IconButton
        icon="close"
        onPress={() => navigation.goBack()}
        style={styles.close}
      />
    ),
  };
};

const NewChat: React.FC = () => {
  const styles = getStyles(useTheme());

  return (
    <View style={styles.container}>
      <Words tag="h1" style={styles.text}>
        Create Chat
      </Words>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {},
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
  });

export default NewChat;
