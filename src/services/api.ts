import axios from 'axios';

// Para Android emulator use 10.0.2.2, para iOS use seu IP local ou localhost
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000',
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
