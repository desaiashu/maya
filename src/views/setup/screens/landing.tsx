import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Linking,
  useColorScheme,
  useWindowDimensions,
  ScaledSize,
  ImageStyle,
} from 'react-native';
import { Theme, useTheme } from '@/ui/theme';
import { Words, Button } from '@/ui/atoms';
import { DOWNLOAD_URL, getImageSource, analytics } from '@/data';

const Landing: React.FC = () => {
  const windowDims = useWindowDimensions();
  const styles = getStyles(useTheme(), windowDims, screenshotDims(windowDims));
  const colorScheme = useColorScheme();

  useEffect(() => {
    analytics.track('visit_landing_page');
  }, []);

  return (
    <View style={styles.container}>
      <Words tag="h1" style={styles.title}>
        Maya
      </Words>
      <Words tag="body" style={styles.description}>
        Maya is an app to help you learn and discover new perspectives. We use a
        Gemini 2.0 Flash for primary response, an uncensored distillation of R1
        as a contrarian perspective, and o3-mini as a holistic perspective. We
        also present web links to go deeper into the topics discussed.
      </Words>
      <Button
        title="Download beta"
        tag="body"
        onPress={() => {
          Linking.openURL(DOWNLOAD_URL);
          analytics.track('landing_download_clicked');
        }}
        style={styles.button}
        outlined
      />
      <View style={styles.screenshots}>
        <Image
          source={getImageSource('chat_screenshot', colorScheme)}
          style={styles.screenshot}
        />
        <Image
          source={getImageSource('perspective_screenshot', colorScheme)}
          style={styles.screenshot}
        />
      </View>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  dims: ScaledSize,
  screenshotDims: ImageStyle,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      minHeight: dims.height,
    },
    title: {
      marginTop: 50,
      marginBottom: 10,
    },
    description: {
      marginTop: 30,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
      maxWidth: 500,
    },
    screenshots: {
      flexDirection: 'row',
    },
    screenshot: {
      ...screenshotDims,
    },
    button: {
      marginBottom: 30,
    },
  });

const screenshotDims = (windowDims: ScaledSize) => {
  const windowHeight = windowDims.height;
  const windowWidth = windowDims.width;

  const maxImageHeight = Math.max(500, windowHeight); // 60% of the window height
  const maxImageWidth = Math.min(400, windowWidth * 0.5); // 80% of the window width

  const aspectRatio = 930 / 1772; // Replace with the actual aspect ratio of the image

  let imageHeight = maxImageHeight;
  let imageWidth = imageHeight * aspectRatio;

  if (imageWidth > maxImageWidth) {
    imageWidth = maxImageWidth;
    imageHeight = imageWidth / aspectRatio;
  }

  return {
    height: imageHeight,
    width: imageWidth,
  };
};

export default Landing;
