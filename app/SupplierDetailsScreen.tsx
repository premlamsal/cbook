import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import api from './lib/api'; // Assuming you have an api instance set up
import { useNavigation, useRoute } from '@react-navigation/native';

const SupplierDetailsScreen = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { supplierId } = route.params; // Retrieve supplierId from route params
  const headerHeight = useHeaderHeight(); // Get the height of the header

  // Fetch supplier details when the component mounts or supplierId changes
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      try {
        const response = await api.get(`/suppliers/${supplierId}`); // Replace with your actual API endpoint
        setSupplier(response.data); // Set the supplier data in the state
      } catch (err) {
        setError('Failed to fetch supplier details');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [supplierId]);

  const handleImageClick = () => {
    Alert.alert('Image Clicked', 'Implement zoom view or gallery here!');
  };

  // Loading state
  if (loading) {
    return <Text>Loading...</Text>; // Or you can show a spinner/loader
  }

  // Error state
  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
      {/* Supplier Image */}
      {/* <TouchableOpacity onPress={handleImageClick}>
        <Image source={{ uri: supplier?.image }} style={styles.image} />
      </TouchableOpacity> */}

      {/* Supplier Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{supplier?.name}</Text>
        <Text style={styles.description}>{supplier?.description}</Text>
      </View>
    </ScrollView>
  );
};

export default SupplierDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'left',
  },
});
