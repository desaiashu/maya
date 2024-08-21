import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Button } from '@/ui/atoms';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/views/navigator';
import { analytics } from '@/data';

export const welcomeOptions = (): NativeStackNavigationOptions => ({
  title: '',
  headerShown: false,
});

const Welcome: React.FC = () => {
  const styles = getStyles(useTheme());

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    analytics.track('welcome_load');
  }, []);

  const go = () => {
    analytics.track('welcome_go');
    navigation.navigate('Auth');
  };

  const welcomeText = `Maya is an app to help you learn and discover new perspectives. Thank you for participating in the beta!

I'm building on top of LLMs to improve knowledge transfer between humans past, present, and future.

Maya refers to the "illusion" of reality, suggesting that no single perspective fully captures ground truth.

The roadmap includes community knowledge contributions, bias detection, multi-user chats, and additional personas.

- All data is encrypted in transit and at rest
- Messages are stored with an anonymous userid
- I'll use anonymized data to improve responses

I don't like ads or venture capital. I want to build a more "human" internet, free from third party incentives. This is a free preview, I'll soon charge for use :)

Questions / feedback?
In the app or ashu@desaidata.com

with <3
ashutosh`;

  return (
    <View style={styles.container}>
      <Words tag="h2" style={styles.title}>
        Hello, friend!
      </Words>
      <Words tag="small" style={styles.description}>
        {welcomeText}
      </Words>
      <Button
        title="Explore Maya"
        tag="body"
        onPress={go}
        style={styles.button}
        outlined
      />
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
    title: {
      marginTop: 50,
      marginBottom: 0,
    },
    description: {
      margin: 30,
    },
    button: {
      marginBottom: 30,
    },
  });

export default Welcome;
