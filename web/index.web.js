import React from 'react';
import { AppRegistry } from 'react-native';
import MayaWeb from './maya.web';
import { name as appName } from '../app.json';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from react-dom/client
import '%/fonts/fonts.css';

// Register the app component
AppRegistry.registerComponent(appName, () => MayaWeb);

// Find the root element & render
const rootElement = document.getElementById('maya-root');
const root = ReactDOM.createRoot(rootElement);
root.render(<MayaWeb />);
