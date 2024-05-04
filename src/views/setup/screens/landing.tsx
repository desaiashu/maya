import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Button } from '@/ui/atoms';
import { DOWNLOAD_URL, getImageSource } from '@/data';

const Landing: React.FC = () => {
  const styles = getStyles(useTheme());
  const colorScheme = useColorScheme();

  const onPress = () => {
    Linking.openURL(DOWNLOAD_URL);
  };

  return (
    <View style={styles.container}>
      <Words tag="h1" style={styles.title}>
        Maya
      </Words>
      <Words tag="body" style={styles.description}>
        Maya is an app to help you learn and discover new perspectives. We use a
        primary LLM, a secondary uncensored contrarian LLM, and a third holistic
        LLM. We also present web links to go deeper into the topics discussed.
      </Words>
      <Image
        source={getImageSource('screenshot', colorScheme)}
        style={styles.screenshot}
      />
      <Button
        title="Download beta"
        tag="body"
        onPress={onPress}
        style={styles.button}
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
      minHeight: Dimensions.get('window').height,
    },
    title: {
      marginBottom: 20,
    },
    description: {
      margin: 30,
    },
    screenshot: {
      height: 200,
    },
    button: {},
  });

export default Landing;
