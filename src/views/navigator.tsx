// ChatUI.tsx

import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, TextStyle, StyleProp } from 'react-native';
import { NavigationContainer, NavigationProp, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Chat, chatOptions, ChatList, chatListOptions, NewChat, newChatOptions } from '@/views/chat';
import { Profile, profileOptions, Auth, authOptions, Verify, verifyOptions } from '@/views/setup';
import { ChatInfo } from '@/data/types';
import {Theme, useTheme}  from '@/ui/theme';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: ChatInfo;
  NewChat: undefined;
  Profile: undefined;
  Auth: undefined;
  Verify: { phoneNumber: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  //const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const theme = useTheme();

  // If logged in, navigate to ChatList
  // Else navigate to Auth
  const initialRoute = 'ChatList';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={defaultNavigationOptions(theme)}>
        <Stack.Screen name="ChatList" component={ChatList} 
          options={({ navigation }) => (chatListOptions(navigation, theme))}
        />
        <Stack.Screen name="NewChat" 
          component={NewChat} 
          options={({ navigation }) => (newChatOptions(navigation, theme))}
        />
        <Stack.Screen name="Profile" 
          component={Profile} 
          options={({ navigation }) => (profileOptions(navigation, theme))} />
        <Stack.Screen name="Chat"
          component={Chat}
          options={({ route }) => (chatOptions(route, theme))}
        />
        <Stack.Screen name="Auth"
          component={Auth}
          options={authOptions(theme)}
        />
        <Stack.Screen name="Verify" 
          component={Verify} 
          options={({ navigation }) => (verifyOptions(navigation, theme))} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const defaultNavigationOptions=(theme: Theme): NativeStackNavigationOptions => ({
  headerStyle: {
    backgroundColor: theme.colors.header, // Your custom background color
  },
  headerTintColor: theme.colors.text.primary, // Your custom color for back button and title
  headerTitleStyle: {
    fontFamily: theme.fonts.h3.fontFamily,
    fontSize: theme.fonts.h3.fontSize,
    fontWeight: theme.fonts.h3.fontWeight,
  },
  headerShadowVisible: false,
});

export default Navigator;