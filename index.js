import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

import { CoreProvider } from './src/context/CoreManagement';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const appCore = () => {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '282959929237-iefi43odclm67tludv485tf1nn80o8tq.apps.googleusercontent.com'
        });
    }, []);
    return (
        <CoreProvider>
            <App />
        </CoreProvider>)
}

AppRegistry.registerComponent(appName, () => appCore);
