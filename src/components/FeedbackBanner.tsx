import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

type FeedbackBannerProps = {
    message: string;
    variant?: 'success' | 'error';
};

export const FeedbackBanner = ({ message, variant = 'success' }: FeedbackBannerProps) => {
    return (
        <View style={[styles.container, variant === 'success' ? styles.success : styles.error]}>
            <Text style={styles.title}>{variant === 'success' ? 'Concluído' : 'Atenção'}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.radius.sm,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
    },
    success: {
        backgroundColor: '#eef8f1',
        borderColor: '#bfe3c8',
    },
    error: {
        backgroundColor: '#fdeeee',
        borderColor: '#f4c2c2',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.ink,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.ink,
    },
});
