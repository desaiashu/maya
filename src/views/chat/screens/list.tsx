import React, { useMemo, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import {
  State,
  useStore,
  server,
  newCommunityChat,
  cancelAnimation,
} from '@/data';
import { ChatInfo } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Avatar } from '@/ui/atoms';
import {
  DrawerNavigationProp,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';

export const chatListOptions = (
  navigation: DrawerNavigationProp<RootStackParamList, 'ChatList'>,
  theme: Theme,
): DrawerNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'history',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerLeft: () => (
      <IconButton
        icon="profile"
        onPress={() => {
          navigation.navigate('Profile');
        }}
        style={styles.profileButton}
      />
    ),
    headerRight: () => (
      <IconButton
        icon="compose"
        onPress={() => {
          const chat = newCommunityChat();
          server.createChat(chat);
          navigation.navigate('Chat', chat);
        }}
        style={styles.composeButton}
      />
    ),
  };
};

const ChatList: React.FC = () => {
  const styles = getStyles(useTheme());

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { chatList, userid, getAvatar, getTopic } = useStore(
    (state: State) => ({
      chatList: state.chats,
      userid: state.currentUser.userid,
      getAvatar: state.getAvatar,
      getTopic: state.getTopic,
    }),
  );

  const sortedChats = useMemo(() => {
    return chatList.slice().sort((a, b) => b.updated - a.updated);
  }, [chatList]);

  const handleSelectChat = useCallback(
    (chatInfo: ChatInfo) => {
      cancelAnimation();
      navigation.navigate('Chat', chatInfo);
    },
    [navigation],
  );

  useFocusEffect(
    React.useCallback(() => {
      server.refreshChatlist();
    }, []),
  );

  const renderChatItem = useCallback(
    ({ item }: { item: ChatInfo }) => {
      let chatInfo = item;
      let avatar = getAvatar(chatInfo, userid);
      let topic = getTopic(chatInfo);
      // let participant = getParticipants(chatInfo, userid);

      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleSelectChat(chatInfo)}
        >
          <Avatar avatar={avatar} size={50} />
          <View style={styles.textContainer}>
            <Words tag="h2" style={styles.name}>
              {topic}
            </Words>
            {/* <Words tag="small" style={styles.topic}>
            {topic}
          </Words> */}
          </View>
        </TouchableOpacity>
      );
    },
    [getAvatar, getTopic, handleSelectChat, userid, styles],
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={sortedChats}
        keyExtractor={chat => chat.chatid}
        renderItem={renderChatItem}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        ListHeaderComponent={<View style={styles.listHeader} />}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 5,
      backgroundColor: theme.colors.background,
    },
    content: {},
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
      height: 100,
    },
    listHeader: {
      height: 100,
    },
    textContainer: {
      flexDirection: 'column', // This is actually the default and can be omitted
    },
    name: {
      marginLeft: 25,
    },
    topic: {
      marginLeft: 25,
      marginTop: 3,
    },
    composeButton: {
      width: 32,
      height: 32,
      marginTop: 2,
      marginRight: -3,
    },
    profileButton: {
      width: 30,
      height: 30,
      marginTop: 0,
      marginLeft: -2,
    },
  });

export default ChatList;
