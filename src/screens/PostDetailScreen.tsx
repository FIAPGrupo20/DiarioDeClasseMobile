import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const PostDetailScreen = ({ route, navigation }: any) => {
    const { post } = route.params;
    const { user } = useAuth();

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Deseja realmente excluir este post?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/posts/${post.id}`);
                            navigation.navigate('Home');
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o post');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.content}>
                <Text style={styles.disciplina}>{post.disciplina}</Text>
                <Text style={styles.title}>{post.titulo}</Text>
                <Text style={styles.info}>Por {post.autor} em {new Date(post.dataCriacao).toLocaleDateString('pt-BR')}</Text>

                <View style={styles.divider} />

                <Text style={styles.body}>{post.conteudo}</Text>

                {user?.role === 'professor' && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.editButton]}
                            onPress={() => navigation.navigate('CreatePost', { post })}
                        >
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.paper,
    },
    content: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    disciplina: {
        backgroundColor: theme.colors.sky,
        color: theme.colors.ink,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.ink,
        marginBottom: 10,
    },
    info: {
        fontSize: 14,
        color: theme.colors.mutedInk,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.line,
        marginBottom: 20,
    },
    body: {
        fontSize: 16,
        color: theme.colors.ink,
        lineHeight: 24,
        marginBottom: 40,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 0.48,
        padding: 15,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: theme.colors.sage,
    },
    deleteButton: {
        backgroundColor: theme.colors.danger,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
