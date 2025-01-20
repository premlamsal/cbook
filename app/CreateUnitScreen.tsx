import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import api from './lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateUnitScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { unitId } = route.params || {}; // Get the unitId from the navigation route

  // Extract unitId from route params to determine if editing
  //  const unitId = route.params?.unitId;

  useEffect(() => {
    // Dynamically set the header title for create or edit
    navigation.setOptions({
      headerTitle: unitId ? 'Edit Unit' : 'Create Unit',
    });

    if (unitId) {
      // Fetch the unit data if in edit mode
      fetchUnitDetails();
    }
  }, [unitId, navigation]);



  // Fetch unit details for editing
  const fetchUnitDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/units/${unitId}`); // Replace with your API endpoint
      const { name, description } = response.data;
      setName(name);
      setDescription(description);
    } catch (err) {
      setError('Failed to load unit details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      if (unitId) {
        // Update existing unit
        await api.put(`/units/${unitId}`, { name, description });
      } else {
        // Create new unit
        await api.post('/units', { name, description });
      }
      navigation.goBack(); // Navigate back to the UnitListScreen
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
        {/* <Text style={styles.headerText}>{unitId ? 'Edit Unit' : 'Create Unit'}</Text> */}
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
              <Text style={styles.saveButtonText}>{unitId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUnitScreen;

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
