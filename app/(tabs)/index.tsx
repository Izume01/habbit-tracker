import getUserSession from "@/hooks/getSession";
import { DATABASE_ID, TABLE_ID, tablesDB } from "@/lib/appwrite";
import { useAuthStore } from "@/store/useStore";
import { Habbits } from "@/types/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Avatar, Button, Chip, FAB, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { user, logout, loading } = useAuthStore();
  const [habbit, setHabbit] = React.useState<Habbits[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.replace("/auth");
  }

  const handleCompleteHabit = (habitId: string) => {
    // TODO: Implement habit completion logic
    console.log("Completing habit:", habitId);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fetchUserHabbit = async () => {
    try {
      const user = await getUserSession()

      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [
          Query.equal('user_id', user?.$id || '')
        ]
      })

      console.log("User habits:", response);

      setHabbit(response.rows as unknown as Habbits[]);
      setError(null);
    } catch (error) {
      setError("Failed to fetch habits");
      console.error("Error fetching habits:", error);
    }
  }

  useEffect(() => {
    fetchUserHabbit();
  }, [])

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily': return 'calendar-today';
      case 'weekly': return 'calendar-week';
      case 'monthly': return 'calendar-month';
      default: return 'calendar';
    }
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return '#FF6B35'; // Orange-red for fire
    if (streak >= 14) return '#FF8500'; // Orange
    if (streak >= 7) return '#FFB700';  // Yellow-orange
    return theme.colors.primary;       // Default primary
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Icon 
              size={48} 
              icon="account" 
              style={styles.avatar}
              color={theme.colors.primary}
            />
            <View style={styles.headerText}>
              <Text variant="headlineSmall" style={styles.title}>Today's Habits</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {habbit.length} {habbit.length === 1 ? 'habit' : 'habits'} to complete
              </Text>
            </View>
          </View>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon={() => <MaterialCommunityIcons name="logout" size={18} color={theme.colors.onPrimary} />}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
          >
            Sign out
          </Button>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Message */}
        {error && (
          <Surface style={styles.errorCard} elevation={1}>
            <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} />
            <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
          </Surface>
        )}

        {/* Stats Cards */}
        {habbit.length > 0 && (
          <View style={styles.statsContainer}>
            <Surface style={styles.statCard} elevation={2}>
              <MaterialCommunityIcons name="fire" size={32} color="#FF6B35" />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {Math.max(...habbit.map(h => h.streak_count))}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>Best Streak</Text>
            </Surface>
            
            <Surface style={styles.statCard} elevation={2}>
              <MaterialCommunityIcons name="target" size={32} color={theme.colors.primary} />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {habbit.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>Active Habits</Text>
            </Surface>
            
            <Surface style={styles.statCard} elevation={2}>
              <MaterialCommunityIcons name="chart-line" size={32} color="#4CAF50" />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {Math.round(habbit.reduce((acc, h) => acc + h.streak_count, 0) / habbit.length) || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>Avg Streak</Text>
            </Surface>
          </View>
        )}

        {/* Habits List */}
        {habbit.length === 0 ? (
          <View style={styles.noHabitsContainer}>
            <MaterialCommunityIcons 
              name="checkbox-multiple-blank-outline" 
              size={80} 
              color={theme.colors.onSurfaceVariant} 
            />
            <Text variant="headlineSmall" style={styles.noHabitsTitle}>No habits yet</Text>
            <Text variant="bodyMedium" style={styles.noHabitsText}>
              Create your first habit to start building{'\n'}healthy routines!
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/add-task')}
              style={styles.createFirstButton}
              icon="plus"
            >
              Create Your First Habit
            </Button>
          </View>
        ) : (
          <View style={styles.habitsGrid}>
            {habbit.map((habit, key) => (
              <Surface key={key} style={styles.habitCard} elevation={3}>
                <Pressable
                  style={styles.habitCardPressable}
                  onPress={() => handleCompleteHabit(habit.$id)}
                  android_ripple={{ color: theme.colors.primary + '20' }}
                >
                  <View style={styles.habitCardHeader}>
                    <View style={styles.habitTitleContainer}>
                      <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={2}>
                        {habit.title}
                      </Text>
                      <Chip
                        mode="outlined"
                        icon={() => (
                          <MaterialCommunityIcons 
                            name={getFrequencyIcon(habit.frequency)} 
                            size={16} 
                            color={theme.colors.primary}
                          />
                        )}
                        style={styles.frequencyChip}
                        textStyle={styles.frequencyChipText}
                      >
                        {habit.frequency}
                      </Chip>
                    </View>
                  </View>

                  {habit.description && (
                    <Text variant="bodySmall" style={styles.cardDescription} numberOfLines={2}>
                      {habit.description}
                    </Text>
                  )}

                  <View style={styles.cardFooter}>
                    <View style={styles.streakContainer}>
                      <MaterialCommunityIcons 
                        name="fire" 
                        size={20} 
                        color={getStreakColor(habit.streak_count)}
                      />
                      <Text variant="bodyMedium" style={[styles.streakText, { color: getStreakColor(habit.streak_count) }]}>
                        {habit.streak_count}
                      </Text>
                      <Text variant="bodySmall" style={styles.streakLabel}>
                        day{habit.streak_count !== 1 ? 's' : ''} streak
                      </Text>
                    </View>

                    <View style={styles.actionButtons}>
                      <Button
                        mode="contained"
                        onPress={() => handleCompleteHabit(habit.$id)}
                        style={styles.completeButton}
                        contentStyle={styles.completeButtonContent}
                        labelStyle={styles.completeButtonLabel}
                        icon="check"
                      >
                        Done
                      </Button>
                    </View>
                  </View>
                </Pressable>
              </Surface>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/add-task')}
        label="Add Habit"
        color={theme.colors.onPrimary}
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerGradient: {
      paddingBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      backgroundColor: theme.colors.surface,
      marginRight: 12,
    },
    headerText: {
      flex: 1,
    },
    title: {
      color: theme.colors.onPrimary,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.colors.onPrimary + 'CC',
      marginTop: 2,
    },
    logoutButton: {
      borderColor: theme.colors.onPrimary + '50',
      borderWidth: 1,
    },
    logoutButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 100,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      color: theme.colors.onBackground,
    },
    errorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 20,
      backgroundColor: theme.colors.errorContainer,
      borderRadius: 16,
    },
    errorText: {
      color: theme.colors.onErrorContainer,
      marginLeft: 12,
      flex: 1,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
    },
    statNumber: {
      color: theme.colors.onSurface,
      fontWeight: '700',
      marginTop: 8,
    },
    statLabel: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
      textAlign: 'center',
    },
    noHabitsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 20,
    },
    noHabitsTitle: {
      color: theme.colors.onBackground,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 12,
    },
    noHabitsText: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    createFirstButton: {
      paddingHorizontal: 16,
    },
    habitsGrid: {
      gap: 16,
    },
    habitCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      overflow: 'hidden',
    },
    habitCardPressable: {
      padding: 20,
    },
    habitCardHeader: {
      marginBottom: 12,
    },
    habitTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardTitle: {
      color: theme.colors.onSurface,
      fontWeight: '600',
      flex: 1,
      marginRight: 12,
    },
    frequencyChip: {
      backgroundColor: theme.colors.primaryContainer + '40',
      borderColor: theme.colors.primary + '30',
    },
    frequencyChipText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
    cardDescription: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    streakText: {
      fontWeight: '700',
      marginLeft: 6,
      fontSize: 16,
    },
    streakLabel: {
      color: theme.colors.onSurfaceVariant,
      marginLeft: 4,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    completeButton: {
      borderRadius: 20,
      minWidth: 80,
    },
    completeButtonContent: {
      paddingVertical: 4,
    },
    completeButtonLabel: {
      fontSize: 14,
      fontWeight: '600',
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: theme.colors.primary,
    },
  });
};