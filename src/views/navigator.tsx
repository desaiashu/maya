// ChatUI.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import ChatList from './chat/screens/list';
import Chat from './chat/screens/chat';
import { ChatInfo } from '../data';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: ChatInfo;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatList" screenOptions={defaultNavigationOptions}>
        <Stack.Screen name="ChatList" component={ChatList} 
          options={{ title: `chats` }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({ title: `${route.params.topic}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const defaultNavigationOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#ffffff', // Your custom background color
  },
  headerTintColor: '#000', // Your custom color for back button and title
  headerTitleStyle: {
    fontWeight: 'bold', // Your custom font weight for title
  },
  headerShadowVisible: false
};

export default Navigator;