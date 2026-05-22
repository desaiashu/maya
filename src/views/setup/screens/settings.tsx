import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
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
import { State, useStore, server, analytics } from '@/data';
import { Profile } from '@/data/types';
import { AvatarSelect } from '@/ui/molecules';
import { getCurrentBundleId, resetToBuiltIn } from '@/data/server/ota';

const NIL_BUNDLE_ID = '00000000-0000-0000-0000-000000000000';

export const settingsOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  route: RouteProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'settings',
    headerTitle: '',
    presentation: route.params?.presentation || 'card',
    headerShown: route.params ? true : false,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: theme.colors.transparent,
    },
    headerLeft: route.params
      ? () => (
          <IconButton
            icon="close"
            onPress={() => navigation.goBack()}
            containerStyle={styles.iconCloseContainer}
            style={styles.iconClose}
            round
            shadow
          />
        )
      : () => <View />,
  };
};

export interface SettingsProps {
  presentation: 'modal';
}

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
  const bundleId = Platform.OS === 'ios' ? getCurrentBundleId() : null;
  const onBuiltIn = !bundleId || bundleId === NIL_BUNDLE_ID;

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

  useEffect(() => {
    if (user.userid !== '_' && !params) {
      analytics.track('user_created');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChatDrawer' }],
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userid]);

  if (user === null) {
    return null;
  }

  const onReset = () => {
    Alert.alert(
      'reset to built-in bundle',
      'drop all installed updates and restart on the binary-shipped bundle. the app will re-check for updates after.',
      [
        { text: 'cancel', style: 'cancel' },
        {
          text: 'reset',
          style: 'destructive',
          onPress: async () => {
            analytics.track('ota_reset', { from: bundleId });
            const ok = await resetToBuiltIn();
            if (!ok) Alert.alert('reset failed');
          },
        },
      ],
    );
  };

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
    if (params) {
      analytics.track('save_settings');
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
          {Platform.OS === 'ios' && !onBuiltIn && (
            <View style={styles.bundleSection}>
              <Words tag="h4" style={styles.bundleLabel}>
                bundle {bundleId?.substring(0, 8)}
              </Words>
              <Button
                outlined
                title="reset to built-in bundle"
                onPress={onReset}
              />
            </View>
          )}
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
    profileInfo: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 100,
    },
    username: {
      marginTop: 10,
      // marginBottom: 40,
    },
    save: {},
    bundleSection: {
      marginTop: 60,
      alignItems: 'center',
    },
    bundleLabel: {
      marginBottom: 12,
      color: theme.colors.text.secondary,
    },
    iconCloseContainer: {
      backgroundColor: theme.colors.background,
      paddingLeft: 1,
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 1,
      marginTop: 5,
      marginLeft: -3,
    },
    iconClose: {
      width: 33,
      height: 33,
    },
  });

export default Settings;
