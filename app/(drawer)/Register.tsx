import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import CustomInput from '../components/CustomInput';
import api from '../lib/api';


export default function RegisterScreen() {
    const router = useRouter();
    const navigation = useNavigation();


    // State for input fields and loading
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async () => {
        setError(null); // Clear previous error
        // console.log('Email & Password Saved:');
        // Add your save logic here (API call or local storage)

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setSuccess(response.data.message);
            console.log('Registration successful:', response.data);

            // Navigate to Login Screen
            navigation.navigate('index');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Registration failed.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            console.error('Error:', err);
        }
    };

    const headerHeight = useHeaderHeight(); // Get the height of the header

    return (
        <View style={[styles.container, { paddingTop: headerHeight }]}>

            <Text style={styles.title}>Register</Text>


            <TextInput
                label="Name"
                value={name}
                style={styles.input}
                onChangeText={setName}
            />

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

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
            />

            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}


            <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
                <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.textButton} onPress={() => navigation.navigate('index')}>
                <Text style={styles.textGray}>Login</Text>
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
        // borderColor: '#ccc',
        // borderWidth: 1,
        // borderRadius: 8,
        // paddingHorizontal: 15,
        marginBottom: 8,
        // backgroundColor: '#fff',
    },

    error: {
        color: 'red',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        marginBottom: 10,
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
        // backgroundColor: '#00695C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    textGray: {
        color: 'gray',
        // fontSize: 16,
        // fontWeight: 'bold',
    },
});
