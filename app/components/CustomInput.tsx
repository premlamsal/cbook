import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Animated } from 'react-native';

const CustomInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    type = 'text', // default to 'text'
    secureTextEntry = false,
    customStyle,
    error,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === 'password';

    // Animation for focus effect
    const borderColor = new Animated.Value(0);
    const animatedBorderColor = borderColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ccc', '#00695C'],
    });

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderColor, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderColor, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={[styles.container, customStyle]}>
            {/* Label */}
            {label && <Text style={[styles.label, isFocused && styles.focusedLabel]}>{label}</Text>}

            {/* Input Box */}
            <Animated.View style={[styles.inputContainer, { borderColor: animatedBorderColor }]}>
                <TextInput
                    style={[styles.input]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry || isPassword}
                    keyboardType={type === 'text' ? 'default' : 'email-address'}
                    autoCapitalize="none"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor="#aaa"
                />
            </Animated.View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    focusedLabel: {
        color: '#00695C',
        // fontWeight: 'bold',
    },
    inputContainer: {
        height: 50,
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        elevation: 1.5, // Add shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1, // Add shadow for iOS
    },
    input: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 14,
    },
});

export default CustomInput;
