import React, { useState, useCallback, useLayoutEffect } from 'react';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ensure Ionicons is installed

const PurchaseListScreen = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchPurchases = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get('/purchases', { params: { search: query } });
      setPurchases(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchPurchases
  const debouncedFetchPurchases = useCallback(debounce(fetchPurchases, 500), []);

  // Handle search input change with debounce
  const handleSearch = (text) => {
    setSearchText(text);
    debouncedFetchPurchases(text); // Use debounced fetch
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchases(); // Fetch purchases without search query on screen focus
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CreatePurchasesScreen')} >
          {/* <Text style={{ color: '#fff', fontWeight: 'light', fontSize: 18, marginEnd: 5 }}>+</Text> */}
          <MaterialIcons name="add" size={25} color="#fff" style={{ marginEnd: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ViewPurchasesScreen', { purchaseId: item.id })}
    >
      <View style={styles.cardContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'green' }}>Purchases-{item.id} </Text>
          </View>
          <View>
            <Text>{formatDate(item.purchase_date)}</Text>

          </View>
        </View>
        <View>
          <Text style={styles.name}>{item.supplier.name}</Text>
          <Text style={styles.sp}>Rs.{item.grand_total}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('CreatePurchasesScreen', { purchaseId: item.id })}
      >
        <MaterialIcons name="edit" size={25} color="#00695C" />

        {/* <Text style={styles.editButtonText}>Edit</Text> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );


  // Helper function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Purchases..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#00695C" style={styles.loader} />
      ) : (
        <FlatList
          data={purchases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            error ? (
              <Text style={styles.emptyText}>{error}</Text>
            ) : (
              <Text style={styles.emptyText}>No purchases found</Text>
            )
          }
        />
      )}
      {/* <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreatePurchasesScreen')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

export default PurchaseListScreen;

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
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 5,
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
    // backgroundColor: '#00695C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#00695C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
