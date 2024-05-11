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
        Meet Maya! (beta)
      </Words>
      <Words tag="small" style={styles.description}>
        Maya is an app to help you learn and discover new perspectives.
        {'\n'}
        {'\n'}We're building on top of LLMs to improve the UX of knowledge
        transfer between humans past, present, and future.
        {'\n'}
        {'\n'}Maya refers to the "illusion" of reality, recognizing that no
        single perspective represents ground truth.
        {'\n'}
        {'\n'}Our roadmap includes community knowledge contributions, bias
        detection, and multi-user chats.
        {'\n'}
        {'\n'}- All data is encrypted in transit and at rest
        {'\n'}- We store messages with an anonymous userid
        {'\n'}- We will use anonymized data to improve responses
        {'\n'}
        {'\n'}We don't serve ads and we don't have shareholders. Our obligation
        is to our users alone.
        {'\n'}
        {'\n'}Questions / feedback?
        {'\n'}In the app or ashu@desaidata.com
        {'\n'}
        {'\n'}With {'<3'}
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
      marginBottom: 10,
    },
    description: {
      margin: 30,
    },
    button: {
      marginBottom: 30,
    },
  });

export default Welcome;
