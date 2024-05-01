import { AppRegistry } from 'react-native';
import MayaWeb from './maya.web';
import { name as appName } from './app.json';

console.log('===============');
console.log(appName);
console.log('===============');

// Register the app component
AppRegistry.registerComponent(appName, () => MayaWeb);

AppRegistry.runApplication(appName, {
  // Use the appName variable for consistency
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
