// maya.tsx = App

import React from 'react';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const Maya = () => {
  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <Navigator />
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default Maya;
