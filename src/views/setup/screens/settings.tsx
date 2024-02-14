import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';
import { useSelector } from 'react-redux';
import { RootState } from '@/data';

export const settingsOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
  return {
    title: 'settings',
    presentation: 'card',
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

  if (user === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Words tag="h4" style={styles.info}>
          Phone Number:
        </Words>
        <Words tag="body" style={styles.phoneNumber}>
          {user.userid}
        </Words>
        <Words tag="h4" style={styles.info}>
          Username:
        </Words>
        <Words tag="body" style={styles.phoneNumber}>
          {user.username}
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
      marginTop: 50,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 20,
      marginTop: 20,
    },
    close: {
      marginLeft: -10,
      marginTop: 1,
    },
    profileInfo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 150,
    },
    username: {
      marginTop: 10,
      fontSize: 20,
    },
    phoneNumber: {
      marginTop: 10,
      fontSize: 20,
    },
  });

export default Settings;
