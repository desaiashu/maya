// maya.tsx = App

import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/data/store';
import Navigator from './src/navigator';

const Maya = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigator />;
      </PersistGate>
    </Provider>
  );
};

export default Maya;