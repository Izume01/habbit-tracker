import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import getUserSession from '@/hooks/getSession'
import { tablesDB, DATABASE_ID, TABLE_ID } from '@/lib/appwrite'
import { ID } from 'react-native-appwrite'
export default function addTask() {
    const theme = useTheme()
    const styles = makeStyles(theme)


    const [descriptionValue, setDescriptionValue] = useState<string>('')
    const [taskName, setTaskName] = useState<string>('')
    const [frequency, setFrequency] = useState<string>('Daily')

    const FREQ = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' },
    ];

    const handleCreateTask = async () => {
        // Logic to handle task creation
        const user = await getUserSession();

        if (!user) return;
        /*
$id
title
description
streak_count
last_completed
        */
        const response = await tablesDB.createRow({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            rowId: ID.unique(),
            data: {
                user_id : user.$id,
                title : taskName,
                description : descriptionValue,
                frequency : frequency,
                streak_count : 0,
                last_completed : new Date().toISOString(),    
            }
        })

        console.log("Task created:", response);
        // LET TO DO 
        // Reset form
        // Handle errors
        // Show success message
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Create New Task
                        </Text>

                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Build healthy habits one task at a time
                        </Text>

                        <View style={styles.formContainer}>
                            <TextInput
                                label="Task Name"
                                placeholder="e.g., Drink 8 glasses of water"
                                value={taskName}
                                onChangeText={setTaskName}
                                mode="outlined"
                                style={styles.input}
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                contentStyle={styles.inputContent}
                            />

                            <TextInput
                                label="Description (Optional)"
                                placeholder="Add more details about your task..."
                                value={descriptionValue}
                                onChangeText={setDescriptionValue}
                                mode="outlined"
                                multiline
                                numberOfLines={3}
                                style={[styles.input, styles.textArea]}
                                outlineColor={theme.colors.outline}
                                activeOutlineColor={theme.colors.primary}
                                contentStyle={styles.inputContent}
                            />

                            <View style={styles.frequencyContainer}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    Frequency
                                </Text>
                                <SegmentedButtons
                                    value={frequency}
                                    onValueChange={setFrequency}
                                    style={styles.segmentedButtons}
                                    buttons={FREQ.map(freq => ({
                                        value: freq.value,
                                        label: freq.label,
                                        style: {
                                            backgroundColor: frequency === freq.value
                                                ? theme.colors.primaryContainer
                                                : theme.colors.surface
                                        },
                                    }))}
                                />
                            </View>

                            <Button
                                mode="contained"
                                onPress={handleCreateTask}
                                style={styles.submitButton}
                                contentStyle={styles.submitButtonContent}
                                labelStyle={styles.submitButtonLabel}
                                disabled={!taskName || !frequency}
                            >
                                Create Task
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


const makeStyles = (theme: any) => {
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        keyboardView: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 32,

        },
        title: {
            color: theme.colors.onBackground,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginBottom: 32,
        },
        formContainer: {
            flex: 1,
        },
        input: {
            marginBottom: 20,
            backgroundColor: theme.colors.surface,
        },
        inputContent: {
            color: theme.colors.onSurface,
        },
        textArea: {
            minHeight: 80,
        },
        frequencyContainer: {
            marginBottom: 24,
        },
        sectionTitle: {
            color: theme.colors.onBackground,
            marginBottom: 12,
            fontWeight: '600',
        },
        segmentedButtons: {
            backgroundColor: theme.colors.surface,
        },
        submitButton: {
            marginTop: 16,
            paddingVertical: 4,
            backgroundColor: theme.colors.primary,

        },
        submitButtonContent: {
            paddingVertical: 8,
        },
        submitButtonLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.onPrimary,
        },
    })
}