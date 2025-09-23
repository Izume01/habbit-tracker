import { useAuthStore } from "@/store/useStore";
import { suppressKnownWarnings } from "@/utils/warningSuppression";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
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
  // Suppress known library warnings on app startup
  useEffect(() => {
    suppressKnownWarnings();
  }, []);

  return (
    <PaperProvider>
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
