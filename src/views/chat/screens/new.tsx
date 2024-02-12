import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/views/navigator';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Theme, useTheme } from '@/ui/theme';

type NewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewChat'>;

export const newChatOptions = (navigation: StackNavigationProp<RootStackParamList, 'NewChat'>, theme: Theme): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return ({
    title: 'new chat',
    presentation: 'modal',
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Close</Text>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => console.log('Edit profile')}>
        <Text>Edit</Text>
      </TouchableOpacity>
    ),
})};

const NewChat: React.FC = () => {
  const styles = getStyles(useTheme());

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Chat</Text>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    color: '#000',
  },
});

export default NewChat;