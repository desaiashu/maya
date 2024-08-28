// maya.web.tsx = Web App Root

import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScaledSize,
} from 'react-native';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme, Theme } from '@/ui/theme';
import { logger } from '@/data';
import Navigator from '@/views/navigator';
import { Landing } from '@/views/setup';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const WebApp = () => {
  const styles = getStyles(useTheme(), useWindowDimensions());
  return (
    <View style={styles.container}>
      <Navigator />
    </View>
  );
};

const MayaWeb = () => {
  logger.info('Web version rendered');
  return (
    <Router>
      <ThemeProvider>
        <ActionSheetProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/:slug" element={<WebApp />} />
          </Routes>
        </ActionSheetProvider>
      </ThemeProvider>
    </Router>
  );
};

const getStyles = (theme: Theme, windowDims: ScaledSize) =>
  StyleSheet.create({
    container: {
      height:
        windowDims.width > 768 ? windowDims.height : windowDims.height + 1, //+ 1,
      width: windowDims.width,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
    },
  });

export default MayaWeb;
