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

  return (
    <View style={styles.container}>
      <Words tag="h2" style={styles.title}>
        Hello, friend!
      </Words>
      <Words tag="small" style={styles.description}>
        Maya is an app to help you learn and discover new perspectives. Thank
        you for participating in the beta!
        {'\n'}
        {'\n'}I'm building on top of LLMs to improve knowledge transfer between
        humans past, present, and future.
        {'\n'}
        {'\n'}Maya refers to the "illusion" of reality, suggesting that no
        single perspective fully captures ground truth.
        {'\n'}
        {'\n'}The roadmap includes community knowledge contributions, bias
        detection, multi-user chats, and additional personas.
        {'\n'}
        {'\n'}- All data is encrypted in transit and at rest
        {'\n'}- Messages are stored with an anonymous userid
        {'\n'}- I'll use anonymized data to improve responses
        {'\n'}
        {'\n'}I don't like ads or venture capitalists. I want to build a more
        "human" internet, free from third party incentives. This is a free
        preview, I'll soon charge for use :)
        {'\n'}
        {'\n'}Questions / feedback?
        {'\n'}In the app or ashu@desaidata.com
        {'\n'}
        {'\n'}with {'<3'}
        {'\n'}ashutosh
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
