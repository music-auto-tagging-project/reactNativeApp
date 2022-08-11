import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

import {CoreProvider} from './src/context/CoreManagement';

const appCore = () => (
    <CoreProvider>
        <App/>
    </CoreProvider>
)


AppRegistry.registerComponent(appName, () => appCore);
