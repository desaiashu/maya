// Chat.tsx

import React, { useEffect, useMemo } from 'react';
import { TextStyle, View, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { RootStackParamList } from '@/views/navigator';
import {
  State,
  useStore,
  newCommunityChat,
  server,
  analytics,
  ANDROID,
} from '@/data';
import { ChatInfo } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import { Words } from '@/ui/atoms';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chat, chatOptions } from '@/views/chat';
import { Profile, profileOptions } from '@/views/setup';

export type DrawerParamList = {
  Profile: undefined;
  Settings: { presentation: 'modal' } | undefined;
} & {
  [key: string]: ChatInfo;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

const ChatDrawer: React.FC = () => {
  const theme = useTheme();
  const userid = useStore((state: State) => state.currentUser.userid);

  const { chats } = useStore((state: State) => ({
    chats: state.chats,
  }));

  const newChat: ChatInfo | undefined = useMemo(() => {
    if (chats.length === 0) {
      console.log('newchat');
      return newCommunityChat();
    }
  }, [chats]);

  const feedbackChat = chats.find(chat => chat.chatid === userid);

  return (
    <Drawer.Navigator
      initialRouteName={chats[0] ? chats[0].chatid : '_new chat'}
      screenOptions={defaultDrawerOptions()}
      drawerContent={renderCustomDrawer(theme)}
    >
      {chats
        .filter(chat => chat.chatid !== userid)
        .sort((a, b) => b.updated - a.updated)
        .map(chat => (
          <Drawer.Screen
            name={chat.chatid + '_' + (chat.topic || 'new chat')}
            key={chat.chatid}
            component={Chat}
            options={({ navigation }) =>
              chatOptions({ navigation, theme, chat })
            }
            initialParams={chat}
          />
        ))}
      <Drawer.Screen
        name={'_new chat'}
        key={'_'}
        component={Chat}
        options={({ navigation }) =>
          chatOptions({ navigation, theme, chat: newChat })
        }
        initialParams={newChat}
      />
      <Drawer.Screen
        name={'Feedback'}
        key={feedbackChat?.chatid}
        component={Chat}
        options={({ navigation }) =>
          chatOptions({ navigation, theme, chat: feedbackChat })
        }
        initialParams={feedbackChat}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => profileOptions(navigation, theme)}
      />
    </Drawer.Navigator>
  );
};

const renderCustomDrawer =
  (theme: Theme) => (props: DrawerContentComponentProps) => {
    const newChatScreen = props.state.routes[props.state.routes.length - 3];
    const excluded = ['Profile', '_new chat', 'Feedback']; // Add the route names you want to exclude
    const filteredProps = {
      ...props,
      state: {
        ...props.state,
        routes: props.state.routes.filter(
          route => !excluded.includes(route.name),
        ),
      },
    };

    return (
      <CustomDrawer
        theme={theme}
        newScreen={newChatScreen}
        {...filteredProps}
      />
    );
  };

interface CustomDrawerProps extends DrawerContentComponentProps {
  theme: Theme;
  newScreen: any;
}

interface ChatLabelProps {
  topic: string;
  focused: boolean;
  theme: Theme;
  style: TextStyle;
}

const renderChatLabel = ({ topic, focused, theme, style }: ChatLabelProps) => (
  <Words
    tag="h5"
    style={[
      theme.fonts.h4,
      {
        color: focused
          ? theme.colors.text.primary
          : theme.colors.text.secondary,
      },
      style,
    ]}
  >
    {topic}
  </Words>
);

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  theme,
  newScreen,
  ...props
}) => {
  const state = props.state;
  const styles = getStyles(theme);
  const routes = state.routes;

  // TODO: make sure this is the right timing to refresh
  const isDrawerOpen = useDrawerStatus() === 'open';
  useEffect(() => {
    if (isDrawerOpen) {
      const refreshChatListAsync = async () => {
        await server.refreshChatlist();
      };
      refreshChatListAsync();
    }
  }, [isDrawerOpen]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Words tag="h3" style={styles.headerText}>
          Chats
        </Words>
      </View>
      <DrawerContentScrollView {...props}>
        <View style={styles.chats}>
          {routes.map(route => {
            const chat = route.params as ChatInfo;
            let selected = false;
            if (routes[state.index] !== undefined) {
              const selectedChat = routes[state.index].params as ChatInfo;
              selected = chat.chatid === selectedChat.chatid;
            } else if (state.index === routes.length) {
              const newChat = newScreen.params as ChatInfo;
              selected = newChat ? chat.created === newChat.created : false;
            }
            return (
              <DrawerItem
                key={chat.chatid}
                label={({ focused }) =>
                  renderChatLabel({
                    topic: chat.topic || 'new chat',
                    focused: focused,
                    theme: theme,
                    style: styles.chatsText,
                  })
                }
                focused={selected}
                activeTintColor={theme.colors.outline}
                onPress={() => {
                  analytics.track('select_chat');
                  props.navigation.navigate(route.name);
                }}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View style={styles.options}>
        <DrawerItem
          label="Give Feedback"
          onPress={() => {
            analytics.track('open_feedback');
            props.navigation.navigate('Feedback');
          }}
          labelStyle={[theme.fonts.h4, styles.optionsText]}
          focused={state.index === routes.length + 1}
          activeTintColor={theme.colors.outline}
          style={styles.footerItem}
        />
        <DrawerItem
          label="Profile"
          onPress={() => {
            analytics.track('view_profile');
            props.navigation.navigate('Profile');
          }}
          labelStyle={[theme.fonts.h4, styles.optionsText]}
          focused={state.index === routes.length + 2}
          activeTintColor={theme.colors.outline}
          style={styles.footerItem}
        />
      </View>
    </SafeAreaView>
  );
};

const defaultDrawerOptions = (): DrawerNavigationOptions => ({
  headerShown: true,
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingBottom: 20,
      marginBottom: 0,
      borderBottomWidth: 1,
      borderColor: theme.colors.outline,
    },
    headerText: {
      marginLeft: 20,
      marginTop: 20,
    },
    itemText: {
      color: theme.colors.text.primary,
    },
    chats: {
      flex: 1,
      paddingLeft: 0,
      marginTop: ANDROID ? 0 : -50,
      borderColor: theme.colors.outline,
    },
    chatsText: {
      marginLeft: 10,
    },
    footerItem: {
      marginTop: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
    options: {
      marginBottom: ANDROID ? 15 : 30,
      marginLeft: 0,
      paddingTop: 10,
      borderTopWidth: 1,
      borderColor: theme.colors.outline,
    },
    optionsText: {
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      marginLeft: 10,
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
