import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { SelectField } from '../components/SelectField';
import { DISCIPLINAS_ENSINO_MEDIO } from '../constants/disciplinas';

export const AdminScreen = () => {
    const [tab, setTab] = useState<'alunos' | 'professores'>('alunos');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Form fields
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [extra, setExtra] = useState(''); // Turma para aluno, Disciplina para professor
    const disciplineOptions = DISCIPLINAS_ENSINO_MEDIO.map((item) => ({ label: item, value: item }));

    const fetchData = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await api.get(`/${tab}`);
            const payload = response.data;
            const list = payload?.[tab] || payload?.data || (Array.isArray(payload) ? payload : []);
            setData(Array.isArray(list) ? list : []);
        } catch (error) {
            setErrorMessage('Não foi possível carregar a lista.');
            Alert.alert('Erro', 'Não foi possível carregar a lista');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tab]);

    const handleSave = async () => {
        setErrorMessage('');
        if (!nome || !email || (!editingItem && !senha)) {
            setErrorMessage('Preencha os campos obrigatórios.');
            Alert.alert('Erro', 'Preencha os campos obrigatórios');
            return;
        }

        try {
            const payload: any = { nome, email };
            if (!editingItem) payload.senha = senha;

            if (tab === 'alunos') payload.turma = extra;
            else payload.disciplina = extra;

            if (editingItem) {
                await api.put(`/${tab}/${editingItem.id}`, payload);
            } else {
                await api.post(`/${tab}`, payload);
            }

            setSuccessMessage(editingItem ? `${tab === 'alunos' ? 'Aluno' : 'Professor'} atualizado com sucesso.` : `${tab === 'alunos' ? 'Aluno' : 'Professor'} cadastrado com sucesso.`);
            setTimeout(() => setSuccessMessage(''), 1800);
            setModalVisible(false);
            fetchData();
        } catch (error) {
            setErrorMessage('Operação falhou. Verifique os dados e tente novamente.');
            Alert.alert('Erro', 'Operação falhou');
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert('Confirmar', 'Deseja remover?', [
            { text: 'Não' },
            {
                text: 'Sim', onPress: async () => {
                    await api.delete(`/${tab}/${id}`);
                    fetchData();
                }
            }
        ]);
    };

    const openModal = (item: any = null) => {
        setEditingItem(item);
        setNome(item?.nome || '');
        setEmail(item?.email || '');
        setSenha('');
        setExtra(tab === 'alunos' ? item?.turma : item?.disciplina || '');
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {!!successMessage && <FeedbackBanner message={successMessage} variant="success" />}
            {!!errorMessage && <FeedbackBanner message={errorMessage} variant="error" />}

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'alunos' && styles.tabActive]}
                    onPress={() => setTab('alunos')}
                >
                    <Text style={[styles.tabText, tab === 'alunos' && styles.tabTextActive]}>Alunos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'professores' && styles.tabActive]}
                    onPress={() => setTab('professores')}
                >
                    <Text style={[styles.tabText, tab === 'professores' && styles.tabTextActive]}>Professores</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.accent} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    style={styles.listRoot}
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    scrollEnabled
                    showsVerticalScrollIndicator
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>{item.nome}</Text>
                                <Text style={styles.itemEmail}>{item.email}</Text>
                                <Text style={styles.itemExtra}>{tab === 'alunos' ? `Turma: ${item.turma}` : `Disciplina: ${item.disciplina}`}</Text>
                            </View>
                            <View style={styles.itemActions}>
                                <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
                                    <Text style={{ color: theme.colors.sage }}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                                    <Text style={{ color: theme.colors.danger }}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingItem ? 'Editar' : 'Cadastrar'} {tab === 'alunos' ? 'Aluno' : 'Professor'}</Text>

                        <ScrollView>
                            <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
                            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
                            {!editingItem && <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />}
                            {tab === 'alunos' ? (
                                <TextInput
                                    placeholder="Turma"
                                    style={styles.input}
                                    value={extra}
                                    onChangeText={setExtra}
                                />
                            ) : (
                                <SelectField
                                    label="Disciplina"
                                    value={extra}
                                    onValueChange={setExtra}
                                    options={disciplineOptions}
                                    placeholder="Selecione a disciplina"
                                />
                            )}

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.btnText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSave}>
                                    <Text style={styles.btnText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, minHeight: 0, backgroundColor: theme.colors.sand },
    tabContainer: { flexDirection: 'row', backgroundColor: theme.colors.paper, padding: 10, paddingTop: 60 },
    tab: { flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: theme.colors.accent },
    tabText: { fontWeight: 'bold', color: theme.colors.mutedInk },
    tabTextActive: { color: theme.colors.accent },
    listRoot: { flex: 1, minHeight: 0 },
    list: { padding: 15 },
    item: {
        backgroundColor: theme.colors.paper,
        padding: 15,
        borderRadius: theme.radius.sm,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2
    },
    itemName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.ink },
    itemEmail: { fontSize: 14, color: theme.colors.mutedInk },
    itemExtra: { fontSize: 12, color: theme.colors.accent, marginTop: 4 },
    itemActions: { flexDirection: 'row' },
    actionBtn: { marginLeft: 15 },
    fab: {
        position: 'absolute', right: 20, bottom: 20,
        backgroundColor: theme.colors.ink, width: 56, height: 56,
        borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4
    },
    fabText: { color: '#fff', fontSize: 24 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderBottomColor: theme.colors.line, marginBottom: 20, padding: 8 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    btn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
    btnCancel: { backgroundColor: theme.colors.line },
    btnSave: { backgroundColor: theme.colors.accent },
    btnText: { color: '#fff', fontWeight: 'bold' }
});
