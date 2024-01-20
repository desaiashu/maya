import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Assuming you have a type for your chat data
type ChatItemType = {
  id: string;
  title: string;
};

type RootStackParamList = {
  Chat: { chatId: string }; // Define the parameters expected by the 'Chat' route
  // ... other routes
};

// Dummy data for chat items
const chatData: ChatItemType[] = [
  { id: '1', title: 'Chat 1' },
  { id: '2', title: 'Chat 2' },
  // ... more chat items
];

const ChatList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSelectChat = (chatId: string) => {
    navigation.navigate('Chat', { chatId });
  };

  const renderChatItem = ({ item }: { item: ChatItemType }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectChat(item.id)}
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default ChatList;