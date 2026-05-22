import { defineConfig } from 'hot-updater';
import { bare } from '@hot-updater/bare';
import { standaloneRepository, standaloneStorage } from '@hot-updater/standalone';

// Toshbox env hosts the OTA endpoints (see ~/the-oracle app.py). Override
// HOT_UPDATER_BASE_URL at publish time to point at a different host.
const BASE = process.env.HOT_UPDATER_BASE_URL ?? 'https://maya.toshbox.dev';

export default defineConfig({
  build: bare({ enableHermes: true }),
  storage: standaloneStorage({
    baseUrl: BASE,
  }),
  database: standaloneRepository({
    baseUrl: `${BASE}/hot-updater`,
  }),
  updateStrategy: 'appVersion',
});
