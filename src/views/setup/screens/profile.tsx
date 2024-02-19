import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Avatar } from '@/ui/atoms';
import { State, useStore } from '@/data';

export const profileOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Profile'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'profile',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    presentation: 'modal',
    headerLeft: () => (
      <IconButton
        icon="close"
        onPress={() => navigation.goBack()}
        style={styles.close}
      />
    ),
    headerRight: () => (
      <IconButton
        icon="settings"
        onPress={() =>
          navigation.navigate('Settings', { presentation: 'modal' })
        }
        style={styles.settings}
      />
    ),
  };
};

const Profile: React.FC = () => {
  const styles = getStyles(useTheme());
  const user = useStore((state: State) => state.currentUser);

  if (user === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar avatar={user.avatar} size={100} style={styles.avatar} />
        <Words tag="h4" style={styles.info}>
          username
        </Words>
        <Words tag="body" style={styles.username}>
          {user.username}
        </Words>
        <Words tag="h4" style={styles.info}>
          phone
        </Words>
        <Words tag="body" style={styles.phoneNumber}>
          {user.userid}
        </Words>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {},
    info: {
      marginTop: 60,
    },
    avatar: {
      borderRadius: 20,
      marginTop: 70,
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    settings: {
      width: 28,
      height: 28,
      marginTop: 4,
      marginRight: -3,
    },
    profileInfo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 150,
    },
    username: {
      marginTop: 20,
      fontSize: 20,
    },
    phoneNumber: {
      marginTop: 22,
      fontSize: 20,
    },
  });

export default Profile;
