import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { AdminScreen } from '../screens/AdminScreen';

const Stack = createStackNavigator();

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: theme.colors.sand,
    },
};

export const AppNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{
                                headerShown: true,
                                title: 'Cadastro',
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen
                            name="PostDetail"
                            component={PostDetailScreen}
                            options={{
                                headerShown: true,
                                title: 'Postagem',
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                            }}
                        />
                        <Stack.Screen
                            name="CreatePost"
                            component={CreatePostScreen}
                            options={{
                                headerShown: true,
                                title: 'Nova postagem',
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                            }}
                        />
                        <Stack.Screen
                            name="Admin"
                            component={AdminScreen}
                            options={{
                                headerShown: true,
                                title: 'Administração',
                                headerBackTitleVisible: false,
                                headerTitleAlign: 'center',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
