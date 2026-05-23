import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    useWindowDimensions,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import { DISCIPLINAS_ENSINO_MEDIO } from '../constants/disciplinas';
import { SelectField } from '../components/SelectField';
import { FeedbackBanner } from '../components/FeedbackBanner';

interface Post {
    id: number;
    titulo: string;
    conteudo: string;
    autor: string;
    disciplina: string;
    dataCriacao: string;
}

export const HomeScreen = ({ navigation }: any) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [texto, setTexto] = useState('');
    const [professor, setProfessor] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [orderBy, setOrderBy] = useState<'dataCriacao' | 'titulo'>('dataCriacao');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const { user, logout } = useAuth();
    const { width } = useWindowDimensions();
    const isWide = width >= 820;
    const disciplineOptions = DISCIPLINAS_ENSINO_MEDIO.map((item) => ({ label: item, value: item }));
    const orderByOptions = [
        { label: 'Mais recentes', value: 'dataCriacao' },
        { label: 'A-Z (Título)', value: 'titulo' },
    ];
    const orderOptions = [
        { label: 'Decrescente', value: 'desc' },
        { label: 'Crescente', value: 'asc' },
    ];

    const fetchPosts = async () => {
        try {
            setErrorMessage('');
            const response = await api.get('/posts');
            const payload = response.data;
            const list = Array.isArray(payload) ? payload : payload?.posts;

            setPosts(Array.isArray(list) ? list : []);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || 'Não foi possível carregar os posts. Verifique a conexão com o servidor.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const visiblePosts = [...posts]
        .filter((post) => {
            const searchValue = texto.trim().toLowerCase();
            const professorValue = professor.trim().toLowerCase();
            const disciplinaValue = disciplina.trim().toLowerCase();

            const matchesText = !searchValue
                || post.titulo.toLowerCase().includes(searchValue)
                || post.conteudo.toLowerCase().includes(searchValue)
                || post.disciplina.toLowerCase().includes(searchValue);

            const matchesProfessor = !professorValue
                || post.autor.toLowerCase().includes(professorValue);

            const matchesDisciplina = !disciplinaValue
                || post.disciplina.toLowerCase() === disciplinaValue;

            return matchesText && matchesProfessor && matchesDisciplina;
        })
        .sort((a, b) => {
            if (orderBy === 'titulo') {
                return order === 'asc'
                    ? a.titulo.localeCompare(b.titulo, 'pt-BR')
                    : b.titulo.localeCompare(a.titulo, 'pt-BR');
            }

            const aDate = new Date(a.dataCriacao).getTime();
            const bDate = new Date(b.dataCriacao).getTime();

            return order === 'asc' ? aDate - bDate : bDate - aDate;
        });

    const clearFilters = () => {
        setTexto('');
        setProfessor('');
        setDisciplina('');
        setOrderBy('dataCriacao');
        setOrder('desc');
    };

    const renderItem = ({ item }: { item: Post }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
        >
            <Text style={styles.postDisciplina}>{item.disciplina}</Text>
            <Text style={styles.postTitle}>{item.titulo}</Text>
            <Text style={styles.postAuthor}>Por: {item.autor}</Text>
            <Text style={styles.postContent} numberOfLines={2}>{item.conteudo}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.postDate}>{new Date(item.dataCriacao).toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.readMore}>Ler postagem</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, isWide && styles.headerWide]}>
                <View>
                    <Text style={styles.welcome}>Olá, {user?.nome}</Text>
                    <Text style={styles.role}>{user?.role === 'professor' ? 'Professor' : 'Aluno'}</Text>
                </View>

                <View style={[styles.headerActions, isWide && styles.headerActionsWide]}>
                    {user?.role === 'professor' && (
                        <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={styles.createButton}>
                            <Text style={styles.createText}>Nova postagem</Text>
                        </TouchableOpacity>
                    )}
                    {user?.role === 'professor' && (
                        <TouchableOpacity onPress={() => navigation.navigate('Admin')} style={styles.adminButton}>
                            <Text style={styles.adminText}>Gestão</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.accent} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    style={styles.listRoot}
                    data={visiblePosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={[styles.list, styles.listGrow, isWide && styles.listWide]}
                    scrollEnabled
                    showsVerticalScrollIndicator
                    refreshing={refreshing}
                    nestedScrollEnabled
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchPosts();
                    }}
                    ListHeaderComponent={(
                        <View>
                            <View style={styles.heroCard}>
                                <Text style={styles.heroTag}>Leitura pública</Text>
                                <Text style={styles.heroTitle}>Postagens educacionais com acesso aberto e autoria protegida.</Text>
                                <Text style={styles.heroText}>Alunos podem navegar livremente pelos conteúdos. Professores autenticados criam, editam e administram o acervo.</Text>
                            </View>

                            <View style={styles.filtersCard}>
                                <Text style={styles.filtersTitle}>Filtros de busca</Text>

                                <View style={[styles.filterGrid, isWide && styles.filterGridWide]}>
                                    <View style={styles.filterBlock}>
                                        <Text style={styles.filterLabel}>Palavras-chave</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={texto}
                                            onChangeText={setTexto}
                                            placeholder="Ex: matemática, cidadania"
                                            placeholderTextColor={theme.colors.mutedInk}
                                        />
                                    </View>

                                    <View style={styles.filterBlock}>
                                        <Text style={styles.filterLabel}>Professor</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={professor}
                                            onChangeText={setProfessor}
                                            placeholder="Ex: João, Maria"
                                            placeholderTextColor={theme.colors.mutedInk}
                                        />
                                    </View>
                                </View>

                                <SelectField
                                    label="Disciplina"
                                    value={disciplina}
                                    onValueChange={setDisciplina}
                                    options={disciplineOptions}
                                    placeholder="Todas as disciplinas"
                                    allowEmptyOption
                                />

                                <View style={[styles.filterGrid, isWide && styles.filterGridWide]}>
                                    <SelectField
                                        label="Ordenar por"
                                        value={orderBy}
                                        onValueChange={(value) => setOrderBy(value as 'dataCriacao' | 'titulo')}
                                        options={orderByOptions}
                                        placeholder="Mais recentes"
                                    />

                                    <SelectField
                                        label="Ordem"
                                        value={order}
                                        onValueChange={(value) => setOrder(value as 'asc' | 'desc')}
                                        options={orderOptions}
                                        placeholder="Decrescente"
                                    />
                                </View>

                                <View style={styles.filtersFooter}>
                                    <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                        <Text style={styles.clearButtonText}>Limpar filtros</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.resultCount}>
                                        {visiblePosts.length} resultado{visiblePosts.length !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                            </View>

                            {!!errorMessage && <FeedbackBanner message={errorMessage} variant="error" />}
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>Nenhuma postagem encontrada com os filtros aplicados.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 0,
        backgroundColor: theme.colors.sand,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: theme.colors.paper,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.line,
    },
    headerWide: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    headerActionsWide: {
        justifyContent: 'flex-end',
    },
    welcome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.ink,
    },
    role: {
        color: theme.colors.mutedInk,
        fontSize: 14,
    },
    createButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: theme.colors.accent,
        borderRadius: 999,
    },
    createText: {
        color: '#fff',
        fontWeight: '700',
    },
    logoutButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.colors.line,
        backgroundColor: theme.colors.paper,
    },
    logoutText: {
        color: theme.colors.danger,
        fontWeight: 'bold',
    },
    adminButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: theme.colors.ink,
        borderRadius: 999,
    },
    adminText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    list: {
        padding: 15,
        paddingBottom: 28,
    },
    listGrow: {
        flexGrow: 1,
    },
    listRoot: {
        flex: 1,
        minHeight: 0,
    },
    listWide: {
        width: '100%',
        maxWidth: 1040,
        alignSelf: 'center',
    },
    heroCard: {
        backgroundColor: theme.colors.paper,
        borderWidth: 1,
        borderColor: theme.colors.line,
        borderRadius: theme.radius.md,
        padding: 22,
        marginBottom: 16,
    },
    heroTag: {
        color: theme.colors.accent,
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 8,
    },
    heroTitle: {
        color: theme.colors.ink,
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 30,
        marginBottom: 8,
    },
    heroText: {
        color: theme.colors.mutedInk,
        fontSize: 15,
        lineHeight: 22,
    },
    filtersCard: {
        backgroundColor: theme.colors.paper,
        borderWidth: 1,
        borderColor: theme.colors.line,
        borderRadius: theme.radius.md,
        padding: 18,
        marginBottom: 16,
    },
    filtersTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.ink,
        marginBottom: 16,
    },
    filterGrid: {
        gap: 12,
        marginBottom: 12,
    },
    filterGridWide: {
        flexDirection: 'row',
    },
    filterBlock: {
        flex: 1,
    },
    filterLabel: {
        color: theme.colors.ink,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.line,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fff',
        color: theme.colors.ink,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
    },
    filtersFooter: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.line,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    clearButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: 999,
        backgroundColor: theme.colors.paper,
    },
    clearButtonText: {
        color: theme.colors.accent,
        fontWeight: '700',
    },
    resultCount: {
        color: theme.colors.mutedInk,
        fontWeight: '600',
    },
    card: {
        backgroundColor: theme.colors.paper,
        padding: 20,
        borderRadius: theme.radius.md,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    postDisciplina: {
        color: theme.colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.ink,
        marginBottom: 5,
    },
    postAuthor: {
        fontSize: 14,
        color: theme.colors.mutedInk,
        marginBottom: 10,
    },
    postContent: {
        fontSize: 14,
        color: theme.colors.ink,
        lineHeight: 20,
    },
    cardFooter: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.line,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postDate: {
        color: theme.colors.mutedInk,
        fontSize: 12,
    },
    readMore: {
        color: theme.colors.night,
        fontWeight: '700',
        fontSize: 13,
    },
    empty: {
        textAlign: 'center',
        marginTop: 14,
        color: theme.colors.mutedInk,
    },
});
