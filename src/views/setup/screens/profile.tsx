import React from 'react';
import { View, StyleSheet } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  DrawerNavigationProp,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words, Avatar } from '@/ui/atoms';
import { State, useStore, analytics, ANDROID } from '@/data';

export const profileOptions = (
  navigation: DrawerNavigationProp<RootStackParamList, 'Profile'>,
  theme: Theme,
): DrawerNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'profile',
    headerTitle: '',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    // presentation: 'modal',
    headerLeft: () => (
      <IconButton
        icon="menu"
        onPress={() => navigation.toggleDrawer()}
        containerStyle={styles.iconMenuContainer}
        style={styles.iconMenu}
        round
        shadow
      />
    ),
    headerRight: () => (
      <IconButton
        icon="settings"
        onPress={() => {
          analytics.track('open_settings');
          navigation.navigate('Settings', { presentation: 'modal' });
        }}
        containerStyle={styles.iconSettingsContainer}
        style={styles.iconSettings}
        round
        shadow
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
        <Words tag="large" style={styles.username}>
          {user.username}
        </Words>
        <Words tag="h4" style={styles.info}>
          userid
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
    profileInfo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 150,
    },
    username: {
      marginTop: 20,
    },
    phoneNumber: {
      marginTop: 26,
      fontSize: 18,
    },
    iconMenuContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 9,
      paddingTop: 9,
      paddingBottom: 9,
      paddingRight: 9,
      marginLeft: 15,
      marginTop: ANDROID ? 5 : 0,
    },
    iconMenu: {
      width: 18,
      height: 18,
    },
    iconSettingsContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 9,
      paddingTop: 9,
      paddingBottom: 9,
      paddingRight: 9,
      marginRight: 14,
      marginTop: ANDROID ? 5 : 0,
    },
    iconSettings: {
      width: 20,
      height: 20,
    },
  });

export default Profile;
