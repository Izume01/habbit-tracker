import React from 'react'
import { StyleSheet  , View} from 'react-native'
import { Text } from 'react-native-paper'

export default function addTask() {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>add-task</Text>
        </View>
    )
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
    }
})