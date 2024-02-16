// maya.tsx = App

import React from 'react';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';

const Maya = () => {
  return (
    <ThemeProvider>
      <Navigator />
    </ThemeProvider>
  );
};

export default Maya;
