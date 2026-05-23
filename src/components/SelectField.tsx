import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Pressable,
} from 'react-native';
import { theme } from '../styles/theme';

export type SelectOption = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    allowEmptyOption?: boolean;
};

export const SelectField = ({
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Selecione',
    allowEmptyOption = false,
}: SelectFieldProps) => {
    const [open, setOpen] = useState(false);

    const normalizedOptions = useMemo(() => {
        const seen = new Set<string>();
        return options.filter((option) => {
            const key = option.value.trim();
            if (!key || seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }, [options]);

    const selectedLabel = useMemo(() => {
        return normalizedOptions.find((option) => option.value === value)?.label || placeholder;
    }, [normalizedOptions, placeholder, value]);

    const modalOptions = useMemo(() => {
        const withEmpty = allowEmptyOption
            ? [{ label: placeholder, value: '' }, ...normalizedOptions]
            : normalizedOptions;

        const seen = new Set<string>();
        return withEmpty.filter((item) => {
            const key = `${item.value.trim()}|${item.label.trim().toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [allowEmptyOption, normalizedOptions, placeholder]);

    return (
        <View style={styles.container}>
            {!!label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} activeOpacity={0.85}>
                <Text style={[styles.triggerText, !value && styles.placeholderText]} numberOfLines={1}>
                    {selectedLabel}
                </Text>
                <View style={styles.chevronWrap}>
                    <Text style={styles.chevron}>▼</Text>
                </View>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                    <Pressable style={styles.sheet} onPress={() => null}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>{label || placeholder}</Text>
                            <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={modalOptions}
                            keyExtractor={(item) => item.value || 'placeholder'}
                            renderItem={({ item }) => {
                                const active = item.value === value;

                                return (
                                    <TouchableOpacity
                                        style={[styles.option, active && styles.optionActive]}
                                        onPress={() => {
                                            onValueChange(item.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.ink,
        marginBottom: 8,
    },
    trigger: {
        minHeight: 52,
        backgroundColor: theme.colors.paper,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.line,
        paddingLeft: 14,
        paddingRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    triggerText: {
        flex: 1,
        color: theme.colors.ink,
        fontSize: 15,
        fontWeight: '600',
        paddingRight: 10,
    },
    placeholderText: {
        color: theme.colors.mutedInk,
        fontWeight: '500',
    },
    chevron: {
        color: theme.colors.mutedInk,
        fontSize: 12,
        lineHeight: 12,
        textAlign: 'center',
    },
    chevronWrap: {
        width: 22,
        height: 22,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.sky,
        marginLeft: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(16, 35, 58, 0.45)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: theme.colors.paper,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
        maxHeight: '72%',
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    sheetTitle: {
        flex: 1,
        color: theme.colors.ink,
        fontSize: 16,
        fontWeight: '700',
    },
    closeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: theme.colors.line,
    },
    closeButtonText: {
        color: theme.colors.ink,
        fontWeight: '700',
        fontSize: 13,
    },
    option: {
        minHeight: 50,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.line,
    },
    optionActive: {
        backgroundColor: theme.colors.sky,
        borderColor: theme.colors.accent,
    },
    optionText: {
        color: theme.colors.ink,
        fontSize: 15,
        fontWeight: '600',
    },
    optionTextActive: {
        color: theme.colors.ink,
    },
});
