import { Platform } from 'react-native';
import { HotUpdater } from '@hot-updater/react-native';
import { logger } from '@/data';

// We surface the minimum that the UI needs. The full shape (id, fileHash,
// manifestUrl, etc.) is in @hot-updater/core's AppUpdateAvailableInfo.
export interface UpdateManifest {
  id: string;
  message?: string | null;
  shouldForceUpdate?: boolean;
}

// Resolves to an update if one is available (anything the server returns —
// hot-updater handles app-version / fingerprint matching server-side).
export async function checkForUpdate(): Promise<UpdateManifest | null> {
  if (Platform.OS !== 'ios') return null;
  try {
    const info = await HotUpdater.checkForUpdate({ updateStrategy: 'appVersion' });
    if (!info) return null;
    return {
      id: info.id,
      message: info.message,
      shouldForceUpdate: info.shouldForceUpdate,
    };
  } catch (e) {
    logger.info('ota check failed: ' + String(e));
    return null;
  }
}

// Downloads + applies the update, then reloads. Native handles the healthy
// beacon (RCTContentDidAppear + 10s grace) and auto-rollback on crash.
export async function downloadUpdate(
  _manifest: UpdateManifest,
  onProgress: (frac: number) => void,
  onError: (msg: string) => void,
): Promise<void> {
  try {
    const info = await HotUpdater.checkForUpdate({ updateStrategy: 'appVersion' });
    if (!info) {
      onError('no update available');
      return;
    }
    const unsubscribe = HotUpdater.addListener('onProgress', ev => {
      onProgress(ev.progress);
    });
    try {
      const ok = await info.updateBundle();
      if (!ok) {
        onError('update install failed');
        return;
      }
      logger.info(`ota install success v${info.id}`);
      HotUpdater.reload();
    } finally {
      unsubscribe();
    }
  } catch (e) {
    onError(String(e));
  }
}

// Reset to the binary-shipped bundle, dropping any installed OTA updates.
// Used as a "panic" path in the settings UI. To avoid immediately re-installing
// the same broken bundle, the maintainer should disable it server-side first.
export async function resetToBuiltIn(): Promise<boolean> {
  const ok = await HotUpdater.resetChannel();
  if (ok) HotUpdater.reload();
  return ok;
}

// Currently-active bundle id. NIL UUID means "built-in bundle".
export function getCurrentBundleId(): string | null {
  return HotUpdater.getBundleId();
}
