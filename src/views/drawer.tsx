// Chat.tsx

import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { State, useStore, newCommunityChat, server } from '@/data';
import { ChatInfo } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton } from '@/ui/atoms';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Chat,
  chatOptions,
  ChatList,
  chatListOptions,
  NewChat,
  newChatOptions,
} from '@/views/chat';
import { Profile, profileOptions } from '@/views/setup';
import { useFocusEffect } from '@react-navigation/native';

export type DrawerParamList = {
  Profile: undefined;
  Settings: { presentation: 'modal' } | undefined;
} & {
  [key: string]: ChatInfo;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

const ChatDrawer: React.FC = () => {
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      server.refreshChatlist();
    }, []),
  );

  const { chats } = useStore((state: State) => ({
    chats: state.chats,
  }));

  if (chats.length === 0) {
    chats.push(newCommunityChat());
  }

  return (
    // <SafeAreaView edges={['top']} style={styles.container}>
    <Drawer.Navigator
      initialRouteName={chats[0] ? chats[0].chatid : 'new chat'}
      screenOptions={defaultDrawerOptions()}
    >
      {chats.map((chat, i) => (
        <Drawer.Screen
          name={chat.chatid}
          key={i}
          component={Chat}
          options={({ navigation }) => chatOptions(navigation, theme, chat)}
          initialParams={chat}
        />
      ))}
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => profileOptions(navigation, theme)}
      />
    </Drawer.Navigator>
  );
};

const defaultDrawerOptions = (): DrawerNavigationOptions => ({
  headerShown: true,
});

const getStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginTop: -8,
    marginBottom: 0,
  },
  back: {
    backgroundColor: theme.colors.background,
    paddingLeft: 11,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 3,
    borderRadius: 20,
    shadowColor: theme.colors.outline,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
    fontWeight: 'bold',
  },
  iconBackContainer: {
    backgroundColor: theme.colors.background,
    paddingLeft: 7,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 9,
    marginLeft: -1,
    borderRadius: 20,
    shadowColor: theme.colors.outline,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
  iconBack: {
    width: 20,
    height: 20,
  },
  iconComposeContainer: {
    backgroundColor: theme.colors.background,
    paddingLeft: 7,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 9,
    marginLeft: -1,
    borderRadius: 20,
    shadowColor: theme.colors.outline,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
  iconCompose: {
    width: 20,
    height: 20,
  },
});

export default ChatDrawer;
