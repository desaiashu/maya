// TokenVerificationScreen.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, TextInput, StyleSheet } from 'react-native';
import { verifyUser } from '@/data/server';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Input, Button } from '@/ui/atoms';

export const verifyOptions = (navigation: StackNavigationProp<RootStackParamList, 'Verify'>, theme: Theme): NativeStackNavigationOptions => {
    // const theme = useTheme();
    return {
        title: 'verify',
        headerStyle: {
            backgroundColor: theme.colors.background//"#F2F2F2",
        },
        headerTransparent: true,
        headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Words tag='body'>back</Words>
        </TouchableOpacity>
        ),
    };
  };

const Verify: React.FC = () => {
    const styles = getStyles(useTheme());
    const navigation = useNavigation();
    const [token, setToken] = useState('');

    const route = useRoute<RouteProp<RootStackParamList, 'Verify'>>();
    const { phoneNumber } = route.params;

    const handleValidateToken = async () => {
        // verifyUser(phoneNumber, token);
        // if (isValidToken) {
        // navigation.navigate('ChatList');
        // } else {
        // alert('Invalid token. Please try again.');
        // }
    };

    return (
        <View style={styles.container}>
        <View>
            <Words style={styles.text} tag='h3'>we texted you a token</Words>
            <View style={styles.form}>
            <Input value={phoneNumber}/>
            <Button title="verify" onPress={handleValidateToken} />
            </View>
            <Button title="text again" onPress={handleValidateToken} outlined />
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

export default Verify;