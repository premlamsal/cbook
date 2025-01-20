import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert, ActivityIndicator, Modal } from 'react-native';

import api from './lib/api'; // Adjust path based on your project structure
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { productId } = route.params; // Product ID passed from navigation
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data); // Assuming response contains the product details
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true); // Open modal with the clicked image
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load product details.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Slider */}
      {product.images && product.images.length > 0 ? (
        <FlatList
          data={product.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item, index) => `image-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleImageClick(item.full_location)}>
              <Image source={{ uri: item.full_location }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No images available</Text>
        </View>
      )}

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Cost Price:</Text>
          <Text style={styles.infoValue}>Rs. {product.cp}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Selling Price:</Text>
          <Text style={styles.infoValue}>Rs. {product.sp}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Current Stock:</Text>
          <Text style={styles.infoValue}> {product.quantity ? product.quantity + ' ' + product.unit.name : 'N/A'}</Text>

        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Opening Stock:</Text>

          <Text style={styles.infoValue}> {product.opening_stock} {product.unit.name}</Text>

        </View>
      </View>

      {/* Full-Screen Modal for Image */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
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
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
    resizeMode: 'contain', // Ensure the image scales properly in the modal
  },
});
