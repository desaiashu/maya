/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Maya from './maya';
import { name as appName } from './app.json';

console.log('.js===============');
console.log(appName);
console.log('===============');

AppRegistry.registerComponent(appName, () => Maya);
