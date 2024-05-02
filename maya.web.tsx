// maya.web.tsx = Web App Root

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { Words } from '@/ui/atoms';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const MayaWeb = () => {
  console.log('Web version rendered');
  return (
    <Router>
      <ThemeProvider>
        <ActionSheetProvider>
          <Routes>
            <Route path="/" element={<Words tag="h5">Home Page</Words>} />
            <Route path="/:slug" element={<Navigator />} />
          </Routes>
        </ActionSheetProvider>
      </ThemeProvider>
    </Router>
  );
};

export default MayaWeb;
