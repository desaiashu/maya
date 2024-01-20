// ChatUI.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from './chat/list';
import Chat from './chat/chat';

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatList">
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({ title: `Chat with ${route.params.chatId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;