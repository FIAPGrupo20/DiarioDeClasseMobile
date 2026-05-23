import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
    useEffect(() => {
        if (Platform.OS !== 'web') {
            return;
        }

        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById('root');

        const prev = {
            htmlHeight: html.style.height,
            bodyHeight: body.style.height,
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            rootHeight: root?.style.height ?? '',
            rootOverflow: root?.style.overflow ?? '',
        };

        html.style.height = '100%';
        body.style.height = '100%';
        body.style.overflow = 'auto';
        body.style.position = 'relative';

        if (root) {
            root.style.height = '100%';
            root.style.overflow = 'auto';
        }

        return () => {
            html.style.height = prev.htmlHeight;
            body.style.height = prev.bodyHeight;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.bodyPosition;

            if (root) {
                root.style.height = prev.rootHeight;
                root.style.overflow = prev.rootOverflow;
            }
        };
    }, []);

    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
