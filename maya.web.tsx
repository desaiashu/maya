// maya.web.tsx = Web App Root

import React from 'react';
import { ThemeProvider } from '@/ui/theme';
import { Chat } from '@/views/chat';
import { Words } from '@/ui/atoms';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const MayaWeb = () => {
  console.log('Web version rendered');
  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <Words tag="h5">Yay</Words>
        <Chat />
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default MayaWeb;
