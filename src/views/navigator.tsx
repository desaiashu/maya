// ChatUI.tsx

import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ChatDrawer from '@/views/drawer';
import {
  Auth,
  authOptions,
  Verify,
  verifyOptions,
  Settings,
  settingsOptions,
} from '@/views/setup';
import { ChatInfo } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { State, useStore, DEV_SCREEN } from '@/data';

export type RootStackParamList = {
  ChatList: undefined;
  ChatDrawer: undefined;
  NewChat: undefined;
  Profile: undefined;
  Auth: undefined;
  Verify: { phoneNumber: string };
  Settings: { presentation: 'modal' } | undefined;
} & {
  [key: string]: ChatInfo;
};

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  const theme = useTheme();

  const { isAuthenticated, username } = useStore((state: State) => ({
    isAuthenticated: state.isAuthenticated,
    username: state.currentUser.username,
  }));

  const userCreated = username !== '';

  let initialRoute: string = 'Auth';

  if (DEV_SCREEN) {
    //Override initialRoute for development
    initialRoute = DEV_SCREEN as string;
  } else if (isAuthenticated && userCreated) {
    initialRoute = 'ChatDrawer';
  } else if (isAuthenticated && !userCreated) {
    initialRoute = 'Settings';
  } else {
    initialRoute = 'Auth';
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={defaultNavigationOptions(theme)}
      >
        <Stack.Screen name="Auth" component={Auth} options={authOptions()} />
        <Stack.Screen
          name="Verify"
          component={Verify}
          options={({ navigation }) => verifyOptions(navigation, theme)}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={({ navigation, route }) =>
            settingsOptions(navigation, route, theme)
          }
        />
        <Stack.Screen name="ChatDrawer" component={ChatDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const defaultNavigationOptions = (
  theme: Theme,
): NativeStackNavigationOptions => ({
  headerStyle: {
    backgroundColor: theme.colors.header, // Your custom background color
  },
  headerShown: false,
  headerTintColor: theme.colors.text.primary, // Your custom color for back button and title
  headerTitleStyle: {
    fontFamily: theme.fonts.h3.fontFamily,
    fontSize: theme.fonts.h3.fontSize,
    fontWeight: theme.fonts.h3.fontWeight,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
});

export default Navigator;
