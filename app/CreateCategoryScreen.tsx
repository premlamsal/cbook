import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import api from './lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateCategoryScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {}; // Get the categoryId from the navigation route

  // Extract categoryId from route params to determine if editing
  //  const categoryId = route.params?.categoryId;

  useEffect(() => {
    // Dynamically set the header title for create or edit
    navigation.setOptions({
      headerTitle: categoryId ? 'Edit Category' : 'Create Category',
    });

    if (categoryId) {
      // Fetch the category data if in edit mode
      fetchCategoryDetails();
    }
  }, [categoryId, navigation]);



  // Fetch category details for editing
  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/categories/${categoryId}`); // Replace with your API endpoint
      const { name, description } = response.data;
      setName(name);
      setDescription(description);
    } catch (err) {
      setError('Failed to load category details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      if (categoryId) {
        // Update existing category
        await api.put(`/categories/${categoryId}`, { name, description });
      } else {
        // Create new category
        await api.post('/categories', { name, description });
      }
      navigation.goBack(); // Navigate back to the CategoryListScreen
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

  const headerHeight = useHeaderHeight(); // Get the height of the header

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}>
        {/* <Text style={styles.headerText}>{categoryId ? 'Edit Category' : 'Create Category'}</Text> */}
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Description"
              value={description}
              onChangeText={setDescription}
            />
            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              <Text style={styles.saveButtonText}>{categoryId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCategoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    paddingBottom: 80,
    marginTop: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
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
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
