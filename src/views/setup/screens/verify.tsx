// TokenVerificationScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
  CommonActions,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Input, Button } from '@/ui/atoms';
import { State, useStore, server } from '@/data';

export const verifyOptions = (
  navigation: StackNavigationProp<RootStackParamList, 'Verify'>,
  theme: Theme,
): NativeStackNavigationOptions => {
  return {
    title: '',
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTransparent: true,
    headerLeft: () => (
      <Button bare title="◁   " onPress={() => navigation.goBack()} />
    ),
  };
};

const Verify: React.FC = () => {
  const styles = getStyles(useTheme());
  const [token, setToken] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'Verify'>>();
  const { phoneNumber } = route.params;

  const { isAuthenticated, userCreated, updateToken } = useStore(
    (state: State) => ({
      isAuthenticated: state.isAuthenticated,
      userCreated: state.currentUser.username !== '',
      updateToken: state.updateToken,
    }),
  );

  useEffect(() => {
    if (isAuthenticated && !userCreated) {
      navigation.navigate('Settings');
    } else if (isAuthenticated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ChatList' }],
        }),
      );
    }
  }, [navigation, isAuthenticated, userCreated]);

  const handleValidateToken = () => {
    server.verifyUser({
      userid: phoneNumber,
      token: token,
      timestamp: new Date().getTime(),
    });
    updateToken(token);
  };

  const sendAgain = () => {
    server.authUser(phoneNumber);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Button outlined title="verify" onPress={handleValidateToken} />
          </View>

          <View style={styles.sendAgain}>
            <Button
              title="send it again"
              tag="small"
              onPress={sendAgain}
              bare
            />
          </View>
        </View>
      </View>
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
    text: {
      // alignSelf: 'flex-start',
      marginLeft: 10,
      marginTop: 3,
    },
    sendAgain: {
      alignSelf: 'flex-start',
      marginTop: 20,
    },
    form: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
  });

export default Verify;
