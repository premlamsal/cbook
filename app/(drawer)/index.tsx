import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput'; // Import the component
import { useHeaderHeight } from '@react-navigation/elements';
import { TextInput } from 'react-native-paper';
import api from '../lib/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight(); // Get the height of the header

    // State for input fields and loading
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Mock login function
    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { email, password });
            const token = response.data.token;
            console.log(response.data.message);
            // Save token to local storage
            AsyncStorage.setItem('auth_token', token);
            // Redirect to a protected screen
            navigation.navigate('Dashboard');
        }
        catch (err) {
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                // console.log(err.response.data.message); // Access error message from the server
                setError(err.response.data.message)
            } else if (err.request) {
                // Request was made but no response was received
                // console.log('No response received:', err.request);
                setError(err.request)
            } else {
                // Something else caused an error
                // console.log('Error:', err.message);
                setError(err.message)

            }
        }
    };

    return (
        <View style={[styles.container, { paddingTop: headerHeight }]}>
            <Text style={styles.title}>Login</Text>


            <TextInput
                label="Email"
                value={email}
                style={styles.input}
                onChangeText={setEmail}

            />

            <TextInput
                label="Password"
                value={password}
                style={styles.input}
                onChangeText={setPassword}
                secureTextEntry
            />


            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Submit Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleLogin}>
                <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* Navigate to Register */}
            <TouchableOpacity
                style={styles.textButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.textGray}>New User?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        height: 60,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#00695C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    textGray: {
        color: 'gray',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
