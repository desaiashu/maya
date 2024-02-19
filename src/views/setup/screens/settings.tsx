import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Button, IconButton, Input, Words } from '@/ui/atoms';
import { State, useStore, server } from '@/data';
import { Profile } from '@/data/types';
import { AvatarSelect } from '@/ui/molecules';

export const settingsOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  route: RouteProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'settings',
    presentation: route.params?.presentation || 'card',
    headerShown: route.params ? true : false,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerLeft: route.params
      ? () => (
          <IconButton
            icon="close"
            onPress={() => navigation.goBack()}
            style={styles.close}
          />
        )
      : () => <View />,
  };
};

const Settings: React.FC = () => {
  const styles = getStyles(useTheme());
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { params } = route;
  const { user, updateUserChats, setUserProfile } = useStore(
    (state: State) => ({
      user: state.currentUser,
      updateUserChats: state.updateUserChats,
      setUserProfile: state.setUserProfile,
    }),
  );

  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  if (user === null) {
    return null;
  }

  const save = () => {
    // check if the username/avatar is empty
    if (username === '' || avatar === '') {
      return;
    }
    const newUser: Profile = {
      userid: user.userid,
      username: username,
      avatar: avatar,
    };
    setUserProfile(newUser);
    updateUserChats(newUser);
    server.updateUserProfile(newUser);
    if (!params) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChatList' }],
        }),
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View
          style={[styles.container, keyboardVisible && styles.keyboardVisibile]}
        >
          <View style={styles.profileInfo}>
            <View>
              <Words tag="h4" style={styles.top}>
                select avatar
              </Words>
            </View>
            <AvatarSelect
              style={styles.avatar}
              selectedIndex={avatar}
              onSelect={setAvatar}
            />
            <View>
              <Words tag="h4" style={styles.info}>
                set username
              </Words>
            </View>
            <View style={styles.form}>
              <Input
                style={styles.username}
                value={username}
                onChangeText={setUsername}
              />
              <Button
                outlined
                title="save"
                style={styles.save}
                onPress={save}
                disabled={username === '' || avatar === '' ? true : false}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    keyboardAvoid: {
      flex: 1,
    },
    keyboardVisibile: {
      marginBottom: 0,
    },
    top: {
      marginLeft: 10,
    },
    info: {
      marginLeft: 10,
      marginBottom: 10,
      marginTop: -20,
    },
    avatar: {
      marginTop: 10,
    },
    form: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    profileInfo: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 100,
    },
    username: {
      marginTop: 10,
      marginBottom: 40,
    },
    save: {},
  });

export default Settings;
