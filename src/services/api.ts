import axios from 'axios';
import { Platform } from 'react-native';

const getDefaultBaseURL = () => {
    const envBaseURL = process.env.EXPO_PUBLIC_API_URL;

    if (envBaseURL) {
        return envBaseURL;
    }

    if (Platform.OS === 'web') {
        return 'http://localhost:3000';
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3000';
    }

    return 'http://localhost:3000';
};

const resolveBaseURL = (baseURL: string) => {
    if (Platform.OS !== 'android') {
        return baseURL;
    }

    try {
        const url = new URL(baseURL);

        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            url.hostname = '10.0.2.2';
            return url.toString().replace(/\/$/, '');
        }

        return baseURL;
    } catch {
        if (baseURL.includes('localhost')) {
            return baseURL.replace('localhost', '10.0.2.2');
        }

        if (baseURL.includes('127.0.0.1')) {
            return baseURL.replace('127.0.0.1', '10.0.2.2');
        }

        return baseURL;
    }
};

const api = axios.create({
    baseURL: resolveBaseURL(getDefaultBaseURL()),
    timeout: 10000,
});

// Interceptor para tratar erros globais (como 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Se o token expirar ou for inválido, podemos limpar o auth aqui se necessário
            console.error('Sessão expirada ou não autorizada');
        }
        if (!error.response) {
            console.error('Falha de conexão com o servidor. Verifique EXPO_PUBLIC_API_URL e se a API está ativa.');
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
