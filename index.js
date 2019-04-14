/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from './App';
import AppNavigators from './AppNavigators/AppNavigator';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppNavigators);
