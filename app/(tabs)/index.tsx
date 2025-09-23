import { useAuthStore } from "@/store/useStore";
import { router } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

export default function Index() {

  const { user, logout, loading } = useAuthStore();

  const handleLogout = () => {  
    logout();
    router.replace("/auth");
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.welcomeText}>Welcome to Health App</Text>
      <Text style={styles.userInfo}>{user?.email || 'No email available'}</Text>
      <Text style={styles.userInfo}>{user?.name || 'No name set'}</Text>
      <Text style={styles.userInfo}>{user?.emailVerification || 'No email verification set'}</Text>
      <Button title="Logout" onPress={() => handleLogout()} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#666",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  button: {
    marginTop: 20,
    width: 150,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "none",
  }
})