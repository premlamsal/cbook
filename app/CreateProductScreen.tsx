import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Button, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import RNPickerSelect from 'react-native-picker-select'; // for dropdowns
import { useNavigation, useRoute } from '@react-navigation/native';

import api from './lib/api';
const CreateProductScreen: React.FC = () => {

  const [product, setProduct] = useState({
    name: '',
    sku: '',
    unit: '',
    category: '',
    description: '',
    costPrice: '',
    sellingPrice: '',
    openingStock: '',
    lowStockQuantity: '',
    hsnCode: '',
    barcode: '',
  });

  const [units, setUnits] = useState<any[]>([]);  // To store units
  const [categories, setCategories] = useState<any[]>([]);  // To store categories
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params || {}; // Get the productId from the navigation route

  const handleInputChange = (field: string, value: string) => {
    setProduct({ ...product, [field]: value });
  };



  useEffect(() => {

    navigation.setOptions({
      headerTitle: productId ? 'Edit Product' : 'Create Product',
    });


    if (productId) {
      // console.log(productId)
      //   // Fetch the product data if in edit mode
      fetchProduct(productId);

    }

    // fetchUnitsAndCategories(); // Fetch units and categories
  }, [productId, navigation]);



  const handleSave = async () => {

    setError('');

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append('name', product.name);
      formData.append('sku', product.sku);
      formData.append('unit_id', product.unit);
      formData.append('category_id', product.category);
      formData.append('description', product.description);
      formData.append('cp', product.costPrice);
      formData.append('sp', product.sellingPrice);
      formData.append('opening_stock', product.openingStock);
      formData.append('low_stock_quantity', product.lowStockQuantity);
      formData.append('hsn_code', product.hsnCode);
      formData.append('bar_code', product.barcode);

      let response;
      if (productId) {
        formData.append('_method', 'PUT'); // Specify update method
        response = await api.post(`/products/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigation.goBack();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Server did not respond.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data if editing an existing product
  const fetchProduct = async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      const productData = response.data;
      setProduct({
        name: productData.name,
        sku: productData.sku,
        unit: productData.unit_id,
        category: productData.category_id,
        description: productData.description,
        costPrice: productData.cp,
        sellingPrice: productData.sp,
        openingStock: productData.opening_stock,
        lowStockQuantity: productData.low_stock_quantity,
        hsnCode: productData.hsn_code,
        barcode: productData.bar_code,
      });

    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const fetchUnitsAndCategories = async () => {
    try {
      // Example API calls to fetch units and categories (replace with your actual API endpoints)
      const unitsResponse = await api.get('/units');
      const categoriesResponse = await api.get('/categories');

      const unitsData = unitsResponse.data;
      const categoriesData = categoriesResponse.data;

      setUnits(unitsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUnitsAndCategories();  // Fetch units and categories when the component loads
  }, []);


  const headerHeight = useHeaderHeight();  // Get the height of the header

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
        <TextInput
          mode="flat"
          outlineColor="#00695C"
          selectionColor="#00695C"
          style={styles.input}
          label="Name"
          value={product.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        <RNPickerSelect
          onValueChange={(value) => handleInputChange('unit', value)}
          value={product.unit}
          items={units.map((unit) => ({
            label: unit.name,   // Display the unit name
            value: unit.id      // Use the unit id as the value
          }))}
          placeholder={{ label: 'Select Unit', value: '' }}
          style={pickerSelectStyles}
        />

        <RNPickerSelect
          onValueChange={(value) => handleInputChange('category', value)}
          value={product.category}
          items={categories.map((category) => ({
            label: category.name,   // Display the category name
            value: category.id      // Use the category id as the value
          }))}
          placeholder={{ label: 'Select Category', value: '' }}
          style={pickerSelectStyles}
        />


        <TextInput
          mode="flat"
          outlineColor="#00695C"
          selectionColor="#00695C"
          style={styles.input}
          label="SKU"
          value={product.sku}
          onChangeText={(text) => handleInputChange('sku', text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '49%' }}>
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={[styles.input]}
              label="Cost Price"
              keyboardType="numeric"
              value={product.costPrice}
              onChangeText={(text) => handleInputChange('costPrice', text)}
            />
          </View>
          <View style={{ width: '49%' }}>
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={[styles.input]}
              label="Selling Price"
              keyboardType="numeric"
              value={product.sellingPrice}
              onChangeText={(text) => handleInputChange('sellingPrice', text)}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '49%' }}>
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Opening Stock"
              keyboardType="numeric"
              value={product.openingStock}
              onChangeText={(text) => handleInputChange('openingStock', text)}
            />
          </View>
          <View style={{ width: '49%' }}>
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Low Stock Quantity"
              keyboardType="numeric"
              value={product.lowStockQuantity}
              onChangeText={(text) => handleInputChange('lowStockQuantity', text)}
            />
          </View>
        </View>

        <TextInput
          mode="flat"
          outlineColor="#00695C"
          selectionColor="#00695C"
          style={styles.input}
          label="HSN Code"
          value={product.hsnCode}
          onChangeText={(text) => handleInputChange('hsnCode', text)}
        />

        <TextInput
          mode="flat"
          outlineColor="#00695C"
          selectionColor="#00695C"
          style={styles.input}
          label="Barcode"
          value={product.barcode}
          onChangeText={(text) => handleInputChange('barcode', text)}
        />

        <TextInput
          mode="flat"
          outlineColor="#00695C"
          selectionColor="#00695C"
          style={styles.input}
          label="Description"
          value={product.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />



        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {
          productId ?
            <TouchableOpacity style={styles.productImageRoll}
              onPress={() => navigation.navigate('ProductImagesScreen', { productId: productId })}

            >
              <Text style={styles.productImageRollText}>Product Image Roll</Text>
            </TouchableOpacity> : null
        }


        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputAndroid: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    height: 'auto',
    paddingBottom: 80,
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
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
  productImageRoll: {
    marginTop: 20,
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  productImageRollText: {
    color: '#000',
    fontSize: 16,
    // fontWeight: 'bold',
  },
  normalButton: {
    marginTop: 20,
    backgroundColor: '#fcfcfc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalButtonText: {
    color: '#00695C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
  },
  // ... other styles
  imageContainer: {
    position: 'relative',
    margin: 8,
  },
  removeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#ff4d4d',
    borderRadius: 50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});

export default CreateProductScreen;
