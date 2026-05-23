import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { DISCIPLINAS_ENSINO_MEDIO } from '../constants/disciplinas';
import { SelectField } from '../components/SelectField';

export const CreatePostScreen = ({ route, navigation }: any) => {
    const editPost = route.params?.post;
    const { user } = useAuth();

    const [titulo, setTitulo] = useState(editPost?.titulo || '');
    const [disciplina, setDisciplina] = useState(editPost?.disciplina || '');
    const [conteudo, setConteudo] = useState(editPost?.conteudo || '');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = async () => {
        setErrorMessage('');
        if (!titulo || !disciplina || !conteudo) {
            setErrorMessage('Preencha título, disciplina e conteúdo.');
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                titulo,
                disciplina,
                conteudo,
                autor: user?.nome || 'Professor',
            };

            if (editPost) {
                await api.put(`/posts/${editPost.id}`, payload);
            } else {
                await api.post('/posts', payload);
            }

            setSuccessMessage(editPost ? 'Post atualizado com sucesso.' : 'Post publicado com sucesso.');
            setTimeout(() => {
                setSuccessMessage('');
                navigation.navigate('Home');
            }, 1400);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Não foi possível salvar o post. Verifique a disciplina e a conexão com o servidor.';
            setErrorMessage(message);
            Alert.alert('Erro', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {!!successMessage && <FeedbackBanner message={successMessage} variant="success" />}
            {!!errorMessage && <FeedbackBanner message={errorMessage} variant="error" />}

            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Aula de Cálculo I"
            />

            <Text style={styles.label}>Disciplina</Text>
            <SelectField
                value={disciplina}
                onValueChange={setDisciplina}
                options={DISCIPLINAS_ENSINO_MEDIO.map((item) => ({ label: item, value: item }))}
                placeholder="Selecione a disciplina"
            />

            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={conteudo}
                onChangeText={setConteudo}
                placeholder="Escreva o resumo da aula..."
                multiline
                numberOfLines={10}
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{editPost ? 'Atualizar' : 'Publicar'}</Text>}
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
        paddingTop: 40,
        paddingBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.ink,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.paper,
        padding: 15,
        borderRadius: theme.radius.sm,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.line,
    },
    textArea: {
        height: 200,
    },
    button: {
        backgroundColor: theme.colors.accent,
        padding: 18,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
