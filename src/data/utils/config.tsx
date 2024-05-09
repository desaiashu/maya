import { LogBox, Platform } from 'react-native';
import { RootStackParamList } from '@/views/navigator';

//////////////////////////////////
// Overrides for development purposes

///// Environment /////
export const ENV: Environment = (process.env.ENV as Environment) || 'dev';

///// Overrides nav stack  /////
export let DEV_SCREEN: Screen;

// Reset local state & storage on app load
export let RESET_STATE = false;

//////////////////////////////////

///// Platform /////
export const WEB = Platform.OS === 'web';

///// Server URL /////

export let DOWNLOAD_URL = 'https://ashu.xyz';

let WS = 'ws';
let HTTP = 'http';
let SSL = 's://';
let SUBDOMAIN = ENV + '.';
let DOMAIN = 'seekmaya.com';
let APP_PORT = '';
let WEB_PORT = '';
const SLUG = '/maya';

// export let API_URL = 'https://' + ENV + '.' + DOMAIN + '/maya/';
//TODO: update urls for toshbox/dev/prod

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
    break;
}

if (['local', 'toshbook'].includes(ENV)) {
  SUBDOMAIN = '';
  SSL = '://';
  APP_PORT = ':8001';
  WEB_PORT = ':3000';
}

export const WEB_URL = HTTP + SSL + DOMAIN + WEB_PORT + '/';
export const WS_URL = WS + SSL + SUBDOMAIN + DOMAIN + APP_PORT + SLUG + '/';

console.log(WEB_URL);
console.log(WS_URL);

///// Logging /////
LogBox.ignoreAllLogs(true);

///// Misc /////
export const FIVE_MINS = 5 * 60000;

///// Types /////
type Environment = 'local' | 'toshbook' | 'toshbox' | 'dev' | 'prod';
type Screen = keyof RootStackParamList | undefined;
