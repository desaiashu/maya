import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { State, useStore, server } from '@/data';
import { ChatInfo } from '@/data/types';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Avatar } from '@/ui/atoms';
import { cancelLayoutAnimation } from '@/data';

export const chatListOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'ChatList'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'chats',
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
        onPress={() => navigation.navigate('NewChat')}
        style={styles.composeButton}
      />
    ),
  };
};

const ChatList: React.FC = () => {
  const styles = getStyles(useTheme());

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { chatList, userid, getAvatar, getTopic, getParticipants } = useStore(
    (state: State) => ({
      chatList: state.chats,
      userid: state.currentUser.userid,
      getAvatar: state.getAvatar,
      getTopic: state.getTopic,
      getParticipants: state.getParticipants,
    }),
  );

  const sortedChats = useMemo(() => {
    return chatList.slice().sort((a, b) => b.updated - a.updated);
  }, [chatList]);

  const handleSelectChat = (chatInfo: ChatInfo) => {
    cancelLayoutAnimation();
    navigation.navigate('Chat', chatInfo);
  };

  useFocusEffect(
    React.useCallback(() => {
      server.refreshChatlist();
    }, []),
  );

  const renderChatItem = ({ item }: { item: ChatInfo }) => {
    let chatInfo = item;
    let avatar = getAvatar(chatInfo, userid);
    let topic = getTopic(chatInfo);
    let participant = getParticipants(chatInfo, userid);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleSelectChat(chatInfo)}
      >
        <Avatar avatar={avatar} size={50} />
        <View style={styles.textContainer}>
          <Words tag="h2" style={styles.name}>
            {participant}
          </Words>
          <Words tag="small" style={styles.topic}>
            {topic}
          </Words>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={sortedChats}
        keyExtractor={chat => chat.chatid}
        renderItem={renderChatItem}
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
