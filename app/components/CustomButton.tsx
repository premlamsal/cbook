import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomButton = ({ title = '', onPress, backgroundColor = '#00695C', textColor = '#FFFFFF' }) => {
    return (

        <TouchableOpacity
            style={[styles.button, { backgroundColor }]} // Apply dynamic background color
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        borderRadius: 8, // Rounded corners
        alignItems: 'center', // Center text
    },
    buttonText: {
        fontSize: 16, // Font size
        fontWeight: 'bold', // Bold text
    },
});

export default CustomButton;
