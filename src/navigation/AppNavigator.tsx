import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { AdminScreen } from '../screens/AdminScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
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
