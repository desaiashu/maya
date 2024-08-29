// maya.tsx = App

import React, { useEffect, useRef } from 'react';
import { UIManager, AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { analytics, ANDROID, server, useStore } from '@/data';

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
      const state = useStore.getState();
      if (state && state.isAuthenticated && state.currentUser.username !== '')
        server.refreshChatlist();
    } else if (
      appState.current === 'active' &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
      analytics.track('close_app');
    }
    appState.current = nextAppState;
  };

  if (ANDROID && UIManager.setLayoutAnimationEnabledExperimental) {
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
