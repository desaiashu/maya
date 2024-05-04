// maya.web.tsx = Web App Root

import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScaledSize,
} from 'react-native';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { Landing } from '@/views/setup';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const WebApp = () => {
  const styles = getStyles(useWindowDimensions());
  return (
    <View style={styles.container}>
      <Navigator />
    </View>
  );
};

const MayaWeb = () => {
  console.log('Web version rendered');
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

const getStyles = (windowDims: ScaledSize) =>
  StyleSheet.create({
    container: {
      minHeight: windowDims.height,
    },
  });

export default MayaWeb;
