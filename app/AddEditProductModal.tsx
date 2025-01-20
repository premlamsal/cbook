import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import CustomButton from './components/CustomButton';
import api from './lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import debounce from 'lodash/debounce'; // Import lodash debounce

export default function Modal() {
  const navigation = useNavigation(); // Access navigation
  const route = useRoute(); // Access route
  const { item, onSave } = route.params || {};
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [product, setProduct] = useState(null); // State to store the selected product

  const [products, setProducts] = useState([]); // For product suggestions
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const headerHeight = useHeaderHeight(); // Get the height of the header

  // Fetch product suggestions
  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await api.get(`/products?search=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function for API calls
  const debouncedFetchProducts = useCallback(
    debounce((query) => {
      fetchProducts(query);
    }, 300),
    [] // Ensures the debounced function is stable across renders
  );

  useEffect(() => {
    // setQuantity(item.unit)
    // console.log('mero ' + item)

    navigation.setOptions({
      headerTitle: item ? 'Edit Item' : 'Add Item',
    });
    debouncedFetchProducts.cancel();
    if (item) {
      handleProductSelect(item);

    }

  }, [item, debouncedFetchProducts]);


  const handleInputChange = (text) => {
    setName(text);

    if (text.trim() === '') {
      // Hide suggestions and clear products if input is empty
      setShowSuggestions(false);
      setProducts([]);
      return;
    }

    setShowSuggestions(true);
    debouncedFetchProducts(text); // Trigger the debounced function
  };

  const handleProductSelect = (product) => {
    setName(product.name);
    setUnit(product.unit.name);
    if (item) {
      setPrice(product.price || '0');
    }
    else (
      setPrice(product.sp)
    )
    setQuantity(product.quantity || '0');
    setProduct(product);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!name || !quantity || !price || !unit) {
      alert('Please fill in all fields: Product Title, Quantity, Unit, and Rate (Price/Unit)');
      return;
    }

    const newItem = {
      id: product?.id,
      productIdDb: product?.id, // Use the product's ID
      productUnitId: product?.unit?.id, // Use the product's unit ID
      name,
      quantity,
      price,
      unit: product?.unit,
      unitId: product?.unit?.id,
    };
    onSave(newItem);
    navigation.goBack();
  };

  const subtotal = (parseFloat(quantity || 0) * parseFloat(price || 0)).toFixed(2);
  const grandTotal = subtotal;

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={{ position: 'relative' }}>
        <TextInput
          mode="flat"
          style={styles.input}
          label="Product Name"
          outlineColor="#00695C"
          selectionColor="#00695C"
          value={name}
          onChangeText={handleInputChange}
        />

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#00695C" />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleProductSelect(item)}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{item.name} --- {item.quantity} {item.unit.name} ---{item.sp}</Text>

                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>



      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          mode="flat"
          style={[styles.input, { width: '49%' }]}
          label="Quantity"
          value={quantity.toString()} // Convert to string
          onChangeText={setQuantity}
          keyboardType="numeric"
          outlineColor="#00695C"
          selectionColor="#00695C"
        />
        <TextInput
          mode="flat"
          style={[styles.input, { width: '49%' }]}
          label="Unit"
          value={unit}
          editable={false} // Lock the unit field
          outlineColor="#00695C"
          selectionColor="#00695C"
        />
      </View>
      <TextInput
        mode="flat"
        style={styles.input}
        label="Rate (Price/Unit)"
        value={price.toString()} // Convert to string
        onChangeText={setPrice}
        keyboardType="numeric"
        outlineColor="#00695C"
        selectionColor="#00695C"
      />
      <View style={styles.totals}>
        <Text>Subtotal: Rs. {subtotal}</Text>
        <Text>Total: Rs. {grandTotal}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton title="Save" onPress={handleSave} backgroundColor="#00695C" textColor="#FFFFFF" />
        <CustomButton title="Cancel" onPress={() => navigation.goBack()} backgroundColor="#FF3B30" textColor="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, backgroundColor: '#f2f2f2', flex: 1, marginTop: 8, },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  suggestions: { backgroundColor: 'red', borderRadius: 4, elevation: 5, maxHeight: 150, },
  totals: { marginTop: 16, padding: 8, backgroundColor: '#fff', borderRadius: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },

  suggestionsContainer: {
    position: 'absolute',
    top: '100%', // Position directly below the TextInput
    left: 0,
    right: 0,
    backgroundColor: '#00695C',
    borderRadius: 4,
    zIndex: 1, // Ensure it appears above other elements
    elevation: 5, // Adds a shadow for better visibility (Android)
    maxHeight: 200, // Limit height to show 5-6 items
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  suggestionText: {
    color: 'white',
    fontSize: 16,
  },
});
