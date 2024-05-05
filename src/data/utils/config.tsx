import { LogBox, Platform } from 'react-native';
import { RootStackParamList } from '@/views/navigator';

//////////////////////////////////
// Overrides for development purposes

///// Environment /////
export const ENV: Environment = 'toshbook';

///// Overrides nav stack  /////
export let DEV_SCREEN: Screen;

// Reset local state & storage on app load
export let RESET_STATE = false;

//////////////////////////////////

///// Platform /////
export const WEB = Platform.OS === 'web';

///// Server URL /////

export let DOMAIN = 'seekmaya.com';
export let DOWNLOAD_URL = 'https://ashu.xyz';
export let WEB_URL = 'https://' + DOMAIN + '/';
export let WS_URL: string = 'wss://' + ENV + '.' + DOMAIN + '/maya/';
// export let API_URL = 'https://' + ENV + '.' + DOMAIN + '/maya/';
//TODO: update urls for toshbox/dev/prod

switch (ENV as Environment) {
  case 'local':
    WS_URL = 'ws://localhost:8001/maya/';
    if (Platform.OS === 'android') {
      WS_URL = 'ws://10.0.2.2:8001/maya/';
    }
    break;
  case 'toshbook':
    WS_URL = 'ws://192.168.7.207:8001/maya/';
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

///// Logging /////
LogBox.ignoreAllLogs(true);

///// Misc /////
export const FIVE_MINS = 5 * 60000;

///// Types /////
type Environment = 'local' | 'toshbook' | 'toshbox' | 'dev' | 'prod';
type Screen = keyof RootStackParamList | undefined;
