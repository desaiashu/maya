// maya.tsx = App

import React from 'react';
import { Platform, UIManager } from 'react-native';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const Maya = () => {
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    console.log('LayoutAnimation enabled');
  }
  console.log('rendered');
  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <Navigator />
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default Maya;
