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
            htmlBackground: html.style.backgroundColor,
            bodyHeight: body.style.height,
            bodyOverflow: body.style.overflow,
            bodyMargin: body.style.margin,
            bodyBackground: body.style.backgroundColor,
            rootHeight: root?.style.height ?? '',
            rootOverflow: root?.style.overflow ?? '',
            rootBackground: root?.style.backgroundColor ?? '',
        };

        html.style.height = '100%';
        html.style.backgroundColor = '#f7f0e8';
        body.style.height = 'auto';
        body.style.overflow = 'auto';
        body.style.margin = '0';
        body.style.backgroundColor = '#f7f0e8';

        if (root) {
            root.style.height = 'auto';
            root.style.overflow = 'visible';
            root.style.backgroundColor = '#f7f0e8';
        }

        return () => {
            html.style.height = prev.htmlHeight;
            html.style.backgroundColor = prev.htmlBackground;
            body.style.height = prev.bodyHeight;
            body.style.overflow = prev.bodyOverflow;
            body.style.margin = prev.bodyMargin;
            body.style.backgroundColor = prev.bodyBackground;

            if (root) {
                root.style.height = prev.rootHeight;
                root.style.overflow = prev.rootOverflow;
                root.style.backgroundColor = prev.rootBackground;
            }
        };
    }, []);

    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}
