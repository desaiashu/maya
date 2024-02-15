import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Button, IconButton, Input, Words } from '@/ui/atoms';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/data';
import { Profile } from '@/data/types';
import { setUserProfile, updateUserChats } from '@/data/slices';
import { AvatarSelect } from '@/ui/molecules';
import { updateUserProfile } from '@/data/server';

export const settingsOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  route: RouteProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'settings',
    presentation: route.params?.presentation || 'modal',
    headerLeft: () => (
      <IconButton
        icon="close"
        onPress={() => navigation.goBack()}
        style={styles.close}
      />
    ),
  };
};

const Settings: React.FC = () => {
  const styles = getStyles(useTheme());
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);

  if (user === null) {
    return null;
  }

  const save = () => {
    const newUser: Profile = {
      userid: user.userid,
      username: username,
      avatar: avatar,
    };
    dispatch(setUserProfile(newUser));
    dispatch(updateUserChats(newUser));
    updateUserProfile(newUser);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Words tag="h4" style={styles.info}>
          select avatar:
        </Words>
        <AvatarSelect
          style={styles.avatar}
          selectedIndex={avatar}
          onSelect={setAvatar}
        />
        <Words tag="h4" style={styles.info}>
          edit username:
        </Words>
        <Input
          style={styles.username}
          value={username}
          onChangeText={setUsername}
        />
        <Button title="Save" style={styles.save} onPress={save} />
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
      marginTop: 20,
    },
    avatar: {
      marginTop: 10,
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    profileInfo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 0,
    },
    username: {
      marginTop: 10,
      marginBottom: 40,
    },
    save: {
      marginTop: 40,
      marginBottom: 30,
    },
  });

export default Settings;
