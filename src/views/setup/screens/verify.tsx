// TokenVerificationScreen.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, Button } from 'react-native';
import { verifyUser } from '@/data/server';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { Theme } from '@/ui/theme';
import { Words } from '@/ui/atoms';

export const verifyOptions = (navigation: StackNavigationProp<RootStackParamList, 'Verify'>, theme: Theme): NativeStackNavigationOptions => {
    // const theme = useTheme();
    return {
        title: 'verify',
        headerStyle: {
            backgroundColor: theme.colors.background//"#F2F2F2",
        },
        headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Words tag='body'>back</Words>
        </TouchableOpacity>
        ),
    };
  };

const Verify: React.FC = () => {
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
        <>
            <TextInput value={token} onChangeText={setToken} />
            <Button title="Go" onPress={handleValidateToken} />
        </>
    );
};

export default Verify;