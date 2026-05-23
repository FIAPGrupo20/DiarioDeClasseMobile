import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [role, setRole] = useState<'professor' | 'aluno'>('aluno');
    const [errorMessage, setErrorMessage] = useState('');
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        setErrorMessage('');
        if (!email || !senha) {
            setErrorMessage('Preencha e-mail e senha para continuar.');
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        try {
            await login(email, senha, role);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Falha na autenticação. Verifique credenciais e conexão com o servidor.';
            setErrorMessage(message);
            Alert.alert('Erro', 'Falha na autenticação. Verifique suas credenciais.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Diário de Classe</Text>

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'aluno' && styles.roleButtonActive]}
                    onPress={() => setRole('aluno')}
                >
                    <Text style={[styles.roleText, role === 'aluno' && styles.roleTextActive]}>Aluno</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'professor' && styles.roleButtonActive]}
                    onPress={() => setRole('professor')}
                >
                    <Text style={[styles.roleText, role === 'professor' && styles.roleTextActive]}>Professor</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>

            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkHighlight}>Cadastre-se</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: theme.colors.sand,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.ink,
        textAlign: 'center',
        marginBottom: 40,
    },
    roleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.line,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: theme.radius.sm,
    },
    roleButtonActive: {
        backgroundColor: theme.colors.paper,
    },
    roleText: {
        color: theme.colors.mutedInk,
        fontWeight: '600',
    },
    roleTextActive: {
        color: theme.colors.accent,
    },
    input: {
        backgroundColor: theme.colors.paper,
        padding: 15,
        borderRadius: theme.radius.sm,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.line,
    },
    button: {
        backgroundColor: theme.colors.accent,
        padding: 15,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        marginTop: 12,
        color: '#b00020',
        textAlign: 'center',
        fontSize: 14,
    },
    linkButton: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: theme.colors.mutedInk,
        fontSize: 16,
    },
    linkHighlight: {
        color: theme.colors.accent,
        fontWeight: 'bold',
    },
});
