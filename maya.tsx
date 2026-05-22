// maya.tsx = App

import React, { useEffect, useRef } from 'react';
import { UIManager, AppState, AppStateStatus, View, ActivityIndicator } from 'react-native';
import { HotUpdater } from '@hot-updater/react-native';
import { ThemeProvider } from '@/ui/theme';
import Navigator from '@/views/navigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { analytics, ANDROID, API_URL, server, useStore } from '@/data';
import { createUpdateResolver } from '@/data/server/ota';

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

// HotUpdater.wrap runs a check-for-update on mount, blocks the UI with
// fallbackComponent while downloading, and calls notifyAppReady() after first
// commit. Native side handles auto-rollback (RCTContentDidAppear + 10s grace +
// signal/exception handlers).
export default HotUpdater.wrap({
  resolver: createUpdateResolver(API_URL + 'hot-updater'),
  updateStrategy: 'appVersion',
  reloadOnForceUpdate: true,
  fallbackComponent: ({ status, progress }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator color="#fff" />
    </View>
  ),
})(Maya);
