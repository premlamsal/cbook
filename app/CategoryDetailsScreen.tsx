import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import api from './lib/api'; // Assuming you have an api instance set up
import { useNavigation, useRoute } from '@react-navigation/native';

const CategoryDetailsScreen = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params; // Retrieve categoryId from route params
  const headerHeight = useHeaderHeight(); // Get the height of the header

  // Fetch category details when the component mounts or categoryId changes
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await api.get(`/categories/${categoryId}`); // Replace with your actual API endpoint
        setCategory(response.data); // Set the category data in the state
      } catch (err) {
        setError('Failed to fetch category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

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
      {/* Category Image */}
      {/* <TouchableOpacity onPress={handleImageClick}>
        <Image source={{ uri: category?.image }} style={styles.image} />
      </TouchableOpacity> */}

      {/* Category Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{category?.name}</Text>
        <Text style={styles.description}>{category?.description}</Text>
      </View>
    </ScrollView>
  );
};

export default CategoryDetailsScreen;

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
