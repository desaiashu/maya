// maya.tsx = App

import React from 'react';

import { Provider } from 'react-redux';
import { ThemeProvider } from './src/ui/theme';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/data/data/store';
import Navigator from './src/views/navigator';


const Maya = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Navigator />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default Maya;