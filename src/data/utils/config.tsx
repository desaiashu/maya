import { LogBox, Platform } from 'react-native';
// import { RootStackParamList } from '@/views/navigator';
import DeviceInfo from 'react-native-device-info';
import { logger } from '@/data/utils/funx';

//////////////////////////////////
// Overrides for development purposes

///// Environment /////
export const ENV: Environment = 'local';

///// Overrides nav stack  /////
export let DEV_SCREEN: Screen;

// Reset local state & storage on app load
export let RESET_STATE = true;

//////////////////////////////////

///// Platform /////
export const WEB = Platform.OS === 'web';
export const WEB_DESKTOP = WEB && window.innerWidth > 768;
export const WEB_MOBILE = WEB && !WEB_DESKTOP;
export const ANDROID = Platform.OS === 'android';

///// Version /////
export const VERSION = WEB ? '0.1.4' : DeviceInfo.getVersion();
logger.info(VERSION);

///// Analytics /////
export let AMPLITUDE_KEY = '1e239f3793b699a7c77df6782b5f233c';

///// Server URL /////
export let DOWNLOAD_URL = 'https://testflight.apple.com/join/7N48ay4u';

let WS = 'ws';
let HTTP = 'http';
let SSL = 's://';
let SUBDOMAIN = ENV + '.';
let DOMAIN = 'seekmaya.com';
let APP_PORT = '';
let WEB_PORT = '';
const SLUG = '/maya';

switch (ENV as Environment) {
  case 'local':
    DOMAIN = 'localhost';
    if (Platform.OS === 'android') {
      DOMAIN = '10.0.2.2';
    }
    break;
  case 'toshbook':
    DOMAIN = '192.168.7.207';
    break;
  case 'toshbox':
    RESET_STATE = false; //safety measure
    DEV_SCREEN = undefined;
    break;
  case 'dev':
    RESET_STATE = false; //safety measure
    DEV_SCREEN = undefined;
    break;
  case 'prod':
    RESET_STATE = false; //safety measure
    DEV_SCREEN = undefined;
    AMPLITUDE_KEY = '5b959d5270a05b890d1b957c92cd7fae';
    break;
}

if (['local', 'toshbook'].includes(ENV)) {
  SUBDOMAIN = '';
  SSL = '://';
  APP_PORT = ':8010';
  WEB_PORT = ':3000';
}

export const WEB_URL = HTTP + SSL + DOMAIN + WEB_PORT + '/';
export const WS_URL = WS + SSL + SUBDOMAIN + DOMAIN + APP_PORT + SLUG + '/';

logger.info(WEB_URL);
logger.info(WS_URL);

///// Logging /////
LogBox.ignoreAllLogs(true);

///// Misc /////
export const FIVE_MINS = 5 * 60000;

///// Types /////
type Environment = 'local' | 'toshbook' | 'toshbox' | 'dev' | 'prod';
type Screen = string | undefined; //keyof RootStackParamList | undefined;
