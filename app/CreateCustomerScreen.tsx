import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import api from './lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateCustomerScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [balance, setBalance] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId } = route.params || {}; // Get the customerId from the navigation route

  // Extract customerId from route params to determine if editing
  //  const customerId = route.params?.customerId;

  useEffect(() => {
    // Dynamically set the header title for create or edit
    navigation.setOptions({
      headerTitle: customerId ? 'Edit Customer' : 'Create Customer',
    });

    if (customerId) {
      // Fetch the customer data if in edit mode
      fetchCustomerDetails();
    }
  }, [customerId, navigation]);



  // Fetch customer details for editing
  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/customers/${customerId}`); // Replace with your API endpoint
      const { name, address, phone, mobile, tax_number, opening_balance, description } = response.data;
      setName(name);
      setAddress(address);
      setPhone(phone);
      setMobile(mobile);
      setTaxNumber(tax_number);
      setOpeningBalance(opening_balance);
      setDescription(description);
    } catch (err) {
      setError('Failed to load customer details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      if (customerId) {
        // Update existing customer
        await api.put(`/customers/${customerId}`, { name, address, phone, mobile, tax_number: taxNumber, opening_balance: openingBalance, description, });
      } else {
        // Create new customer
        await api.post('/customers', { name, address, phone, mobile, tax_number: taxNumber, opening_balance: openingBalance, description, });
      }
      navigation.goBack(); // Navigate back to the CustomerListScreen
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
        {/* <Text style={styles.headerText}>{customerId ? 'Edit Customer' : 'Create Customer'}</Text> */}
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
              label="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Phone"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Mobile"
              value={mobile}
              onChangeText={setMobile}
            />
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Tax Number"
              value={taxNumber}
              onChangeText={setTaxNumber}
            />
            <TextInput
              mode="flat"
              outlineColor="#00695C"
              selectionColor="#00695C"
              style={styles.input}
              label="Opening Balance"
              value={openingBalance}
              onChangeText={setOpeningBalance}
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
              <Text style={styles.saveButtonText}>{customerId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCustomerScreen;

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
