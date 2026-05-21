import { Platform } from 'react-native';
import hotUpdate from 'react-native-ota-hot-update';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { API_URL, logger } from '@/data';

export interface UpdateManifest {
  version: number;
  name: string;
  url: string;
  sha256?: string;
  notes?: string;
}

const MANIFEST_URL = API_URL + 'updates/ios/latest';

export async function checkForUpdate(): Promise<UpdateManifest | null> {
  if (Platform.OS !== 'ios') return null;
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return null;
    const manifest: UpdateManifest = await res.json();
    if (!manifest?.version) return null;
    const current = await hotUpdate.getCurrentVersion();
    if (manifest.version > current) return manifest;
    return null;
  } catch (e) {
    logger.info('ota check failed: ' + String(e));
    return null;
  }
}

export function downloadUpdate(
  manifest: UpdateManifest,
  onProgress: (frac: number) => void,
  onError: (msg: string) => void,
) {
  hotUpdate.downloadBundleUri(
    ReactNativeBlobUtil,
    manifest.url,
    manifest.version,
    {
      restartAfterInstall: true,
      progress: (received, total) => {
        const r = parseInt(received, 10);
        const t = parseInt(total, 10);
        if (t > 0) onProgress(r / t);
      },
      updateSuccess: () => {
        logger.info('ota install success');
      },
      updateFail: msg => {
        onError(typeof msg === 'string' ? msg : String(msg));
      },
    },
  );
}
