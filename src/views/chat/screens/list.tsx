import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { ChatInfo } from '@/data/types';
import { RootState, getDefaultAvatar, getAvatarSource } from '@/data';
import {
  getAvatarByChatId,
  getTopicByChatId,
  getParticipantsByChatId,
} from '@/data/slices';
import { refreshChatlist } from '@/data/server';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';

export const chatListOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'ChatList'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: `chats`,
    headerRight: () => (
      <IconButton
        icon="compose"
        onPress={() => navigation.navigate('NewChat')}
        style={styles.composeButton}
      />
    ),
    headerLeft: () => (
      <IconButton
        icon="profile"
        onPress={() => navigation.navigate('Profile')}
        style={styles.profileButton}
      />
    ),
  };
};

// Memoized selectors for Avatars and Topics to display in the chat list
const selectChatList = (state: RootState) => state.chatlist.chats;
const selectAvatars = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) =>
    chatList.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = getAvatarByChatId(state, chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof getAvatarByChatId>>),
);
const selectParticipants = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) =>
    chatList.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = getParticipantsByChatId(state, chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof getTopicByChatId>>),
);
const selectTopics = createSelector(
  [selectChatList, (state: RootState) => state],
  (chatList, state) =>
    chatList.reduce((acc, chatInfo) => {
      acc[chatInfo.chatid] = getTopicByChatId(state, chatInfo.chatid);
      return acc;
    }, {} as Record<string, ReturnType<typeof getTopicByChatId>>),
);

const ChatList: React.FC = () => {
  const styles = getStyles(useTheme());
  const colorScheme = useColorScheme();

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
    }, []),
  );

  const renderChatItem = ({ item }: { item: ChatInfo }) => {
    let chatInfo = item;
    let avatar = avatars[chatInfo.chatid];
    let avatarSource = getAvatarSource(avatar, colorScheme);
    let defaultAvatar = getDefaultAvatar(colorScheme);
    let topic = topics[chatInfo.chatid];
    let participant = participants[chatInfo.chatid];

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleSelectChat(chatInfo as ChatInfo)}
      >
        <Image
          source={avatarSource}
          defaultSource={defaultAvatar} // Default avatar before remote image loads
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Words tag="h3" style={styles.name}>
            {participant}
          </Words>
          <Words tag="body" style={styles.topic}>
            {topic}
          </Words>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={chat => chat.chatid}
        renderItem={renderChatItem}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // marginTop: 5,
      paddingTop: 5,
      backgroundColor: theme.colors.background,
    },
    itemContainer: {
      padding: 20,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.background,
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
      // fontSize: 20,
      marginLeft: 20,
      // fontWeight: 'bold',
    },
    topic: {
      // fontSize: 16,
      marginLeft: 20,
      marginTop: 3,
    },
    avatar: {
      height: 50,
      width: 50,
      borderRadius: 5,
    },
    composeButton: {
      width: 35,
      height: 40,
      marginTop: 0,
      marginRight: -5,
    },
    profileButton: {
      width: 30,
      height: 30,
      marginTop: 0,
      marginLeft: -2,
    },
  });

export default ChatList;
