import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { SelectField } from '../components/SelectField';
import { DISCIPLINAS_ENSINO_MEDIO } from '../constants/disciplinas';

export const RegisterScreen = ({ navigation }: any) => {
    const [role, setRole] = useState<'professor' | 'aluno'>('aluno');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [extra, setExtra] = useState(''); // Turma para aluno, Disciplina para professor
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const disciplineOptions = DISCIPLINAS_ENSINO_MEDIO.map((item) => ({ label: item, value: item }));

    const handleRegister = async () => {
        setErrorMessage('');
        if (!nome || !email || !senha || !extra) {
            setErrorMessage('Preencha todos os campos para continuar.');
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            const payload: any = { nome, email, senha };

            if (role === 'alunos') { // Ajustando para o que a API espera
                // Na verdade o endpoint do backend é /alunos ou /professores
            }

            if (role === 'professor') {
                await api.post('/professores', { ...payload, disciplina: extra });
            } else {
                await api.post('/alunos', { ...payload, turma: extra });
            }

            setSuccessMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            setTimeout(() => {
                setSuccessMessage('');
                navigation.navigate('Login');
            }, 1400);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Falha ao realizar cadastro.';
            setErrorMessage(message);
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Criar Conta</Text>

            {!!successMessage && <FeedbackBanner message={successMessage} variant="success" />}
            {!!errorMessage && <FeedbackBanner message={errorMessage} variant="error" />}

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'aluno' && styles.roleButtonActive]}
                    onPress={() => setRole('aluno')}
                >
                    <Text style={[styles.roleText, role === 'aluno' && styles.roleTextActive]}>Sou Aluno</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'professor' && styles.roleButtonActive]}
                    onPress={() => setRole('professor')}
                >
                    <Text style={[styles.roleText, role === 'professor' && styles.roleTextActive]}>Sou Professor</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {role === 'professor' ? (
                <SelectField
                    label="Disciplina"
                    value={extra}
                    onValueChange={setExtra}
                    options={disciplineOptions}
                    placeholder="Selecione a disciplina"
                />
            ) : (
                <TextInput
                    style={styles.input}
                    placeholder="Turma (ex: 3º Ano A)"
                    value={extra}
                    onChangeText={setExtra}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkHighlight}>Entrar</Text></Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.sand,
    },
    content: {
        padding: 20,
        paddingTop: 80,
        paddingBottom: 40,
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
        marginBottom: 30,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.line,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
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
        marginTop: 15,
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
