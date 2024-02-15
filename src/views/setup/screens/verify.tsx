// TokenVerificationScreen.js
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { verifyUser, authUser } from '@/data/server';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Input, Button } from '@/ui/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { updateToken } from '@/data/slices';
import { RootState } from '@/data';

export const verifyOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Verify'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  // const theme = useTheme();
  return {
    title: 'verify',
    headerStyle: {
      backgroundColor: theme.colors.background, //"#F2F2F2",
    },
    headerTransparent: true,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Words tag="body">back</Words>
      </TouchableOpacity>
    ),
  };
};

const Verify: React.FC = () => {
  const styles = getStyles(useTheme());
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'Verify'>>();
  const { phoneNumber } = route.params;

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Settings', { presentation: 'card' });
    }
  }, [navigation, isAuthenticated]);

  const handleValidateToken = () => {
    verifyUser({
      userid: phoneNumber,
      token: token,
      timestamp: new Date().getTime(),
    });
    dispatch(updateToken(token));
  };

  const sendAgain = () => {
    authUser(phoneNumber);
  };

  return (
    <View style={styles.container}>
      <View>
        <Words style={styles.text} tag="h3">
          we sent a verification
        </Words>
        <Words style={styles.text} tag="h3">
          code on whatsapp
        </Words>
        <View style={styles.form}>
          <Input value={token} caps={true} onChangeText={setToken} />
          <Button title="verify" onPress={handleValidateToken} />
        </View>

        <View style={styles.sendAgain}>
          <Button
            title="send it again"
            tag="small"
            onPress={sendAgain}
            outlined
          />
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
      marginTop: 3,
    },
    sendAgain: {
      alignSelf: 'flex-start',
      marginTop: 40,
    },
    form: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
  });

export default Verify;
