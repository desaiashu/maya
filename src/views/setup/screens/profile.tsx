import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Text, useColorScheme } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { IconButton, Words } from '@/ui/atoms';
import { User } from '@/data/types';
import { useSelector } from 'react-redux';
import { RootState, getAvatarSource, getDefaultAvatar } from '@/data';

export const profileOptions = (navigation: StackNavigationProp<RootStackParamList, 'Profile'>, theme: Theme): NativeStackNavigationOptions => {
  const styles = getStyles(theme);
    return ({
      title: 'profile',
      presentation: 'modal',
      headerLeft: () => (
        <IconButton icon='close' onPress={() => navigation.goBack()} style={styles.close}/>
      ),
      // headerRight: () => (
      //   <IconButton icon='edit' onPress={() => console.log('Edit profile')} style={styles.edit}/>
      // ),
  })};



const Profile: React.FC = () => {
  const styles = getStyles(useTheme());
  const user = useSelector((state: RootState) => state.user.currentUser);
  const colorScheme = useColorScheme();

  if (user === null) {
    return null;
  }
  const defaultAvatar = getDefaultAvatar(colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={getAvatarSource(user.avatar || defaultAvatar, colorScheme)}
          defaultSource={defaultAvatar} // Default avatar before remote image loads
          style={styles.avatar}
        />
        <Words tag='h4' style={styles.info}>Phone Number:</Words>
        <Words tag='body' style={styles.phoneNumber}>{user.userid}</Words>
        <Words tag='h4' style={styles.info}>Username:</Words>
        <Words tag='body' style={styles.phoneNumber}>{user.username}</Words>
      </View>

    </View>
  );

};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {

  },
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
  edit: {
    width: 35,
    height: 35,
    marginTop: 1,
    marginRight: -3
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

export default Profile;