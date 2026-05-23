import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../services/api';

interface User {
    id: number;
    nome: string;
    email: string;
    role: string;
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    login: (email: string, senha: string, role: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const normalizeRole = (role: string | undefined) => {
    const value = (role || '').toLowerCase();

    if (value.includes('admin')) return 'admin';
    if (value.includes('prof')) return 'professor';
    return 'aluno';
};

const normalizeUser = (rawUser: any): User => ({
    ...rawUser,
    role: normalizeRole(rawUser?.role),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('@DiarioDeClasse:user');
            const storedToken = await AsyncStorage.getItem('@DiarioDeClasse:token');

            if (storedUser && storedToken) {
                setUser(normalizeUser(JSON.parse(storedUser)));
                setToken(storedToken);
                setAuthToken(storedToken);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, senha: string, role: string) => {
        setLoading(true);
        try {
            const api = (await import('../services/api')).default;
            const response = await api.post('/auth/login', { email, senha, role });

            const { token, user } = response.data;
            const normalizedUser = normalizeUser(user);

            await AsyncStorage.setItem('@DiarioDeClasse:token', token);
            await AsyncStorage.setItem('@DiarioDeClasse:user', JSON.stringify(normalizedUser));

            setToken(token);
            setUser(normalizedUser);
            setAuthToken(token);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setToken(null);
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
