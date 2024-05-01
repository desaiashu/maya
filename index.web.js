import { AppRegistry } from 'react-native';
import MayaWeb from './maya.web'; // Ensure this points to the correct file
import { name as appName } from './app.json';

// Register the app component
AppRegistry.registerComponent(appName, () => MayaWeb);

AppRegistry.runApplication(appName, {
  // Use the appName variable for consistency
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
