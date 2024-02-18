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
import { State, getDefaultAvatar, getAvatarSource } from '@/data';
import { server, getState } from '@/data';
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
    title: 'chats',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: () => (
      <IconButton
        icon="profile"
        onPress={() => navigation.navigate('Profile')}
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
  const colorScheme = useColorScheme();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { chatList, avatars, topics, participants } = getState(
    (state: State) => ({
      chatList: state.chats,
      avatars: state.getAvatars(state.currentUser.userid),
      topics: state.getTopics(),
      participants: state.getParticipants(state.currentUser.userid),
    }),
  );

  const handleSelectChat = (chatInfo: ChatInfo) => {
    navigation.navigate('Chat', chatInfo);
  };

  useFocusEffect(
    React.useCallback(() => {
      server.refreshChatlist();
    }, []),
  );

  const renderChatItem = ({ item }: { item: ChatInfo }) => {
    let chatInfo = item;
    let defaultAvatar = getDefaultAvatar(colorScheme);
    let avatar = avatars[chatInfo.chatid];
    if (avatar === '') {
      avatar = defaultAvatar;
    }

    let avatarSource = getAvatarSource(avatar, colorScheme);
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
        style={styles.content}
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
    content: {
      paddingTop: 100,
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
