import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Input, Button, Words } from '@/ui/atoms';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { authUser, reinitalizeWebSocket } from '@/data/server';
import { setPhone } from '@/data/slices';
import { useDispatch } from 'react-redux';

export const authOptions = (): NativeStackNavigationOptions => ({
  title: '',
  headerShown: false,
});

const Auth: React.FC = () => {
  const styles = getStyles(useTheme());
  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [phoneNumber, setPhoneNumber] = useState('+');

  const sendToken = () => {
    dispatch(setPhone(phoneNumber));
    console.log('sending token');
    reinitalizeWebSocket();
    authUser(phoneNumber);
    navigation.navigate('Verify', { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <View>
        <Words style={styles.text} tag="h3">
          enter phone number
        </Words>
        <View style={styles.form}>
          <Input phone value={phoneNumber} onChangeText={setPhoneNumber} />
          <Button title="Verify" onPress={sendToken} />
        </View>
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
    text: {
      // alignSelf: 'flex-start',
      marginLeft: 10,
    },
    form: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
  });

export default Auth;
