import { LogBox, Platform } from 'react-native';
import { RootStackParamList } from '@/views/navigator';

//////////////////////////////////
// Overrides for development purposes

///// Environment /////
export const ENV: Environment = 'toshbox';

///// Overrides nav stack  /////
export let DEV_SCREEN: Screen;

// Reset local state & storage on app load
export let RESET_STATE = false;

//////////////////////////////////

///// Server URL /////
export let WS_URL: string;
switch (ENV as Environment) {
  case 'local':
    WS_URL = 'wss://localhost:8001/maya/';
    if (Platform.OS === 'android') {
      WS_URL = 'wss://10.0.2.2:8001/maya/';
    }
    break;
  case 'toshbook':
    WS_URL = 'wss://192.168.7.207:8001/maya/';
    break;
  case 'toshbox':
    WS_URL = 'wss://maya.txtai.co/maya/';
    RESET_STATE = false; //safety measure
    DEV_SCREEN = undefined;
    break;
  case 'dev':
    WS_URL = 'wss://dev.txtai.co/maya/';
    RESET_STATE = false; //safety measure
    DEV_SCREEN = undefined;
    break;
  case 'prod':
    WS_URL = 'wss://txtai.co/maya/';
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
