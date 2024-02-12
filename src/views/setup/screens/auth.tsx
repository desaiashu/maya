import React, { useState, useRef } from 'react';
import { Alert, Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Input, Button, Words } from '@/ui/atoms';
import { RootStackParamList } from '@/views/navigator';
import { Theme, useTheme } from '@/ui/theme';

export const authOptions = (theme: Theme): NativeStackNavigationOptions => ({
    title: 'auth',
    headerShown: false,
  });

  
const Auth: React.FC = () => {
  const styles = getStyles(useTheme());

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [phoneNumber, setPhoneNumber] = useState('+');

  return (
    <View style={styles.container}>
      <View>
        <Words style={styles.text} tag='h3'>enter phone number</Words>
        <View style={styles.form}>
          <Input phone value={phoneNumber} onChangeText={setPhoneNumber}/>
          <Button title="Verify" onPress={()=>navigation.navigate('Verify', {phoneNumber})} />
        </View>
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

export default Auth;