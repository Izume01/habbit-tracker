import React from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Login() {
    return (
        <View
            style={styles.container}
        >
            <Text>Login Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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