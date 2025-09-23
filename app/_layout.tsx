import { useAuthStore } from "@/store/useStore";
import { suppressKnownWarnings } from "@/utils/warningSuppression";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { initialize, user, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/");
    } else {
      router.replace("/auth");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Create custom theme with consistent colors
  const customLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#8130ce',
      primaryContainer: '#e4c1f7',
      secondary: '#6b4c7a',
      secondaryContainer: '#edd1f0',
      surface: '#ffffff',
      surfaceVariant: '#f5f5f5',
      background: '#fefbff',
      onBackground: '#1c1b1f',
      onSurface: '#1c1b1f',
    },
  };

  const customDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#c79ceb',
      primaryContainer: '#663d96',
      secondary: '#d0b5d8',
      secondaryContainer: '#533561',
      surface: '#141218',
      surfaceVariant: '#49454f',
      background: '#141218',
      onBackground: '#e6e1e5',
      onSurface: '#e6e1e5',
    },
  };

  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

  // Suppress known library warnings on app startup
  useEffect(() => {
    suppressKnownWarnings();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RouteGuard>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
