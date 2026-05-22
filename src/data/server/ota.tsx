import { Platform } from 'react-native';
import { HotUpdater } from '@hot-updater/react-native';
import type { HotUpdaterResolver } from '@hot-updater/react-native';
import { logger } from '@/data';

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

// Mirrors the server invariant: when the device is already on its baseline
// (bundleId == NIL or bundleId == minBundleId), a ROLLBACK→NIL response is a
// no-op that would otherwise apply, reload, re-check, and loop forever. Drop
// it on the floor. Everything else passes through unchanged.
export function createUpdateResolver(baseURL: string): HotUpdaterResolver {
  return {
    checkUpdate: async params => {
      const url =
        params.updateStrategy === 'fingerprint'
          ? `${baseURL.replace(/\/+$/, '')}/fingerprint/${params.platform}/${params.fingerprintHash}/${params.channel}/${params.minBundleId}/${params.bundleId}/${encodeURIComponent(params.cohort)}`
          : `${baseURL.replace(/\/+$/, '')}/app-version/${params.platform}/${params.appVersion}/${params.channel}/${params.minBundleId}/${params.bundleId}/${encodeURIComponent(params.cohort)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), params.requestTimeout ?? 5000);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json', ...params.requestHeaders },
        });
        if (res.status !== 200) throw new Error(res.statusText);
        const info = await res.json();
        const atBaseline = params.bundleId === NIL_UUID || params.bundleId === params.minBundleId;
        if (
          info?.status === 'ROLLBACK' &&
          info?.id === NIL_UUID &&
          info?.fileUrl == null &&
          atBaseline
        ) {
          return { status: 'UP_TO_DATE' };
        }
        return info;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}

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
