import { LogBox } from 'react-native';

///// Environment /////
export const ENV: Environment = 'device';

// Reset local state & storage on app load
export let RESET_STATE = false;

///// Server URL /////
export let WS_URL: string;
switch (ENV as Environment) {
  case 'local':
    WS_URL = 'ws://localhost:8001/maya/';
    break;
  case 'device':
    WS_URL = 'ws://192.168.7.207:8001/maya/';
    break;
  case 'dev':
    WS_URL = 'ws://dev.txtai.co/maya/';
    break;
  case 'prod':
    WS_URL = 'ws://txtai.co/maya/';
    RESET_STATE = false; //safety measure
    break;
}

///// Logging /////
LogBox.ignoreAllLogs(true);

///// Misc /////
export const FIVE_MINS = 5 * 60000;

///// Types /////
type Environment = 'local' | 'device' | 'dev' | 'prod';
