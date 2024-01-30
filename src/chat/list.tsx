import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigator';
import { ChatItemType, chatData, userAvatar, einsteinAvatar, gptAvatar } from './data';



const ChatList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSelectChat = (chatId: string, title: string, avatar: number) => {
    navigation.navigate('Chat', { chatId, title, avatar});
  };

  const renderChatItem = ({ item }: { item: ChatItemType }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectChat(item.chatId, item.title, item.avatar)}
    >
      <Image
      source={item.avatar}
      defaultSource={userAvatar} // Default avatar before remote image loads
      style={styles.avatar}
    />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.chatId}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 20,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 15
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 3,
  },
});

export default ChatList;