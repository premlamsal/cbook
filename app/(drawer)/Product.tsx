import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../lib/api'; // Your API wrapper
// import Ionicons from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash/debounce'; // Import lodash debounce
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get('/products', { params: { search: query } });
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchProducts
  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  // Handle search input change with debounce
  const handleSearch = (text) => {
    setSearchText(text);
    debouncedFetchProducts(text); // Use debounced fetch
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts(); // Fetch products without search query on screen focus
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={{}}>Rs.{item.sp}</Text>
        <Text style={{}}>{item.quantity ? item.quantity + ' ' + item.unit.name : 'N/A'}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('CreateProductScreen', { productId: item.id })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Products..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#00695C" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            error ? (
              <Text style={styles.emptyText}>{error}</Text>
            ) : (
              <Text style={styles.emptyText}>No products found</Text>
            )
          }
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateProductScreen')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },


  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00695C',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1, // Allows content to take the available space
    marginRight: 16, // Space between content and the edit button
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#00695C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
