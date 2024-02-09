import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigator';
import { ChatInfo, RootState, refreshChatlist, getAvatarByChatId, getParticipantsByChatId, getTopicByChatId, getLocalUser, defaultAvatar} from '../../../data';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

// Memoized selectors for Avatars and Topics to display in the chat list
const selectChatList = (state: RootState) => state.chatlist.chats;
const selectAvatars = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) => chatList.reduce((acc, chatInfo) => {
    acc[chatInfo.chatid] = getAvatarByChatId(state, chatInfo.chatid);
    return acc;
  }, {} as Record<string, ReturnType<typeof getAvatarByChatId>>)
);
const selectParticipants = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) => chatList.reduce((acc, chatInfo) => {
    acc[chatInfo.chatid] = getParticipantsByChatId(state, chatInfo.chatid);
    return acc;
  }, {} as Record<string, ReturnType<typeof getTopicByChatId>>)
);
const selectTopics = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) => chatList.reduce((acc, chatInfo) => {
    acc[chatInfo.chatid] = getTopicByChatId(state, chatInfo.chatid);
    return acc;
  }, {} as Record<string, ReturnType<typeof getTopicByChatId>>)
);


const ChatList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const chatList = useSelector((state: RootState) => state.chatlist.chats);

  const avatars = useSelector(selectAvatars);
  const topics = useSelector(selectTopics);
  const participants = useSelector(selectParticipants);

  const handleSelectChat = (chatInfo: ChatInfo) => {
    navigation.navigate('Chat', chatInfo);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshChatlist();
    }, [])
  );

  const renderChatItem = ({ item }: { item: ChatInfo }) => {

    let chatInfo = item;
    let avatar = avatars[chatInfo.chatid];
    let topic = topics[chatInfo.chatid];
    let participant = participants[chatInfo.chatid];
    
    return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectChat(chatInfo as ChatInfo)}
    >
      <Image
      source={avatar}
      defaultSource={defaultAvatar} // Default avatar before remote image loads
      style={styles.avatar}
    />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{participant}</Text>
        <Text style={styles.topic}>{topic}</Text>
      </View>
    </TouchableOpacity>
  )};

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(chat) => chat.chatid}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    // backgroundColor: 'white',
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
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    height: 100,
  },
  textContainer: {
    flexDirection: 'column', // This is actually the default and can be omitted
    // justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  topic: {
    fontSize: 16,
    marginLeft: 20,
    marginTop: 3,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 3,
  },
});

export default ChatList;