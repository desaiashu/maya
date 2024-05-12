// maya.tsx = App

import React, { useEffect, useRef } from 'react';
import { Platform, UIManager, AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { analytics } from '@/data';

const Maya = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      analytics.track('open_app');
    } else if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      analytics.track('close_app');
    }
    appState.current = nextAppState;
  };

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <Navigator />
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default Maya;
