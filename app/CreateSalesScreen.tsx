import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { TextInput, Button, Dialog, Portal, Searchbar } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './components/CustomButton';
import api from './lib/api';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons (or any other icon library)
import debounce from 'lodash/debounce';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateSalesScreen = () => {
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const route = useRoute();

  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);


  const [invoiceItems, setInvoiceItems] = useState([]);

  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const { saleId } = route.params || {}; // Get the productId from the navigation route

  useEffect(() => {
    if (!saleId) return; // Ensure saleId is available
    fetchSales(saleId);

    // Fetch customers from the API
    api.get('/customers')
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));

    // Fetch sales data in edit mode

    // Set the navigation title
    navigation.setOptions({
      headerTitle: saleId ? 'Edit Sales' : 'Create Sales',
    });

  }, [saleId]);


  const fetchSales = async (id) => {

    try {
      const response = await api.get(`/sales/${id}`);
      const saleData = response.data;
      const saleDataItems = response.data.details;
      handleCustomerSelect(saleData.customer);
      setInvoiceDate(saleData.invoice_date ? new Date(saleData.invoice_date) : new Date());
      setDueDate(saleData.due_date ? new Date(saleData.due_date) : new Date());

      const tempInvoiceItems = saleDataItems.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
        sp: item.price,
        unitId: item.unit_id,
        id: item.product_id,
        unit: item.unit, // Fallback for unit
        productIdDb: item.product_id,
        productUnitId: item.unit_id,
        name: item.product.name,
      }));
      setInvoiceItems(tempInvoiceItems);


      console.log(tempInvoiceItems)

    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  // Fetch customers suggestions
  const fetchCustomers = async (query) => {
    setLoading(true);
    try {
      const response = await api.get(`/customers?search=${query}`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce API calls to minimize server hits
  const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 500), []);

  const handleTextChange = (text) => {
    setCustomerName(text);
    setShowSuggestions(true);
    debouncedFetchCustomers(text);
  };

  const handleCustomerSelect = (customer) => {
    setCustomerId(customer.id); // Set selected customer name
    setCustomerName(customer.name); // Set selected customer name
    setShowSuggestions(false); // Hide suggestions
  };


  const handleAddItem = (item) => {
    setInvoiceItems((prevItems) => {
      const index = prevItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index] = item;
        return updatedItems;
      }
      return [...prevItems, { ...item, id: item.id }];
    });
  };

  const subtotal = invoiceItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const tax = subtotal * 0.13;
  const grandTotal = subtotal + tax;

  const saveSale = async () => {
    setLoading(true);

    // if (!customerId) {
    //   alert('Customer ID not set. Please try again later.');
    //   return;
    // }
    // Prepare the sale data to send
    const saleData = {
      invoiceDate,
      dueDate,
      tax: 0,
      discount: 0,
      customerId: customerId, // Assuming `selectedCustomer` is an object
      invoiceItems: invoiceItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        unitId: item.productUnitId,
        unit: item.unit,

      })),
    };


    try {
      setLoading(true); // Start loading

      let response;

      console.log('Sale Data: Prem:  ', saleData); // Log the data to check values

      if (saleId) {
        response = await api.put(`/sales/${saleId}`, saleData);
      } else {
        response = await api.post('/sales', saleData);
      }

      // console.log(response.data);
      if (response.data.success) {
        // Optionally, navigate or reset the form after saving
        // navigation.goBack();
        alert(response.data.message);
      } else {
        alert('Failed to save sale');
      }
    } catch (error) {
      console.error('Error occurred while saving sale:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Error saving sale. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }

    navigation.goBack()




  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={saveSale}>
          <MaterialIcons name="check" size={25} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, saveSale]);



  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShow(false);
    if (mode === 'date') {
      setInvoiceDate(currentDate);
    } else {
      setDueDate(currentDate);
    }
  };
  const handleRemoveItem = (id) => {
    const updatedItems = invoiceItems.filter((item) => item.id !== id);
    setInvoiceItems(updatedItems); // Update the state
  };


  return (
    <SafeAreaView style={[styles.container, { paddingTop: headerHeight }]}>
      <View style={[styles.invoiceDetails, { position: 'relative' }]}>
        <TextInput
          mode="flat"
          style={styles.input}
          label="Customer"
          value={customerName}
          outlineColor="#00695C"
          selectionColor="#00695C"
          onChangeText={handleTextChange}
        />
        {showSuggestions && (
          <View style={{ position: 'absolute', top: 60, left: 0, right: 0, zIndex: 10, backgroundColor: '#00695C', }}>
            {loading ? (
              <ActivityIndicator size="small" color="#00695C" />
            ) : (
              <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#fafafa' }}
                    onPress={() => handleCustomerSelect(item)}
                  >
                    <Text style={{ color: '#fff' }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>
      {/* Date Picker for Invoice Date and Due Date */}
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginTop: 0 }}>
        <View style={{ width: '49%' }}>
          <View style={{ margin: 8 }}>
            <Text>Invoice Date</Text>
            <Text style={{}}>{invoiceDate.toLocaleDateString()}</Text>
          </View>

          <CustomButton
            title="Select Date"
            onPress={showDatepicker}
            backgroundColor="#00695C"
            textColor="#FFFFFF"
          />
        </View>
        <View style={{ width: '49%' }}>
          <View style={{ margin: 8 }}>
            <Text>Due Date</Text>
            <Text style={{}}>{dueDate.toLocaleDateString()}</Text>
          </View>
          <CustomButton
            title="Select Due Date"
            onPress={showDatepicker}
            backgroundColor="#00695C"
            textColor="#FFFFFF"
          />
        </View>
      </View> */}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginTop: 0 }}>
        <View style={{ width: '49%' }}>
          <View style={{ margin: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Invoice Date</Text>
            <TouchableOpacity onPress={showDatepicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 5 }}>{invoiceDate.toLocaleDateString()}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#00695C" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: '49%' }}>
          <View style={{ margin: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Due Date</Text>
            <TouchableOpacity onPress={showDatepicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 5 }}>{dueDate.toLocaleDateString()}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#00695C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* DatePicker Modal */}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={mode === 'date' ? invoiceDate : dueDate}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <View style={styles.itemDetails}>
        <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.itemDetailsText}>Item Details</Text>


          <TouchableOpacity
            onPress={() => navigation.navigate('AddEditProductModal', { onSave: handleAddItem })}

            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 5 }}>Add Item</Text>
            <MaterialIcons name="add" size={30} color="#00695C" />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ height: 426, borderRadius: 30 }}
          data={invoiceItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 16, backgroundColor: '#fff', marginTop: 5, flex: 1 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddEditProductModal', { item, onSave: handleAddItem })
                }
              >
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.name} -
                  </Text>
                </View>
                <View style={styles.itemRowS}>
                  {/* <View style={{ flexDirection: 'row' }}> */}
                  <Text style={{ marginRight: 5 }}>{item.quantity} {item.unit.name} x Rs.{item.price}</Text>
                  <Text style={styles.itemPrice}>
                    Rs.{item.quantity * item.price}
                  </Text>
                  {/* </View> */}
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} >
                    <MaterialIcons name="delete" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>

              </TouchableOpacity>

            </View>
          )
          }
        />
      </View >

      <View style={{ marginBottom: 5 }}>
      </View>


      <View>
        {errorMessage ? (
          <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.subTotalAmount}>
          <Text style={styles.totalText}>Sub Total Amount</Text>
          <Text style={styles.totalValue}>Rs. {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.subTotalAmount}>
          <Text style={styles.totalText}>Inclusive Tax (13%)</Text>
          <Text style={styles.totalValue}>Rs.{tax.toFixed(2)}</Text>
        </View>
        <View style={styles.totalAmount}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalValue}>Rs.{grandTotal.toFixed(2)}</Text>
        </View>
      </View>


    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { height: 60, backgroundColor: '#fff', marginBottom: 8 },
  inputDate: { height: 60, backgroundColor: '#fff', marginBottom: 8 },
  invoiceDetails: { margin: 5 },
  itemDetails: { margin: 5 },
  itemDetailsText: { fontSize: 10, color: '#00695C', textTransform: 'uppercase', letterSpacing: 4, textAlign: 'center' },
  subTotalAmount: { padding: 5, flexDirection: 'row', justifyContent: 'space-between' },
  totalText: { color: '#fff', fontSize: 14 },
  totalValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  totalAmount: { padding: 5, flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 5, backgroundColor: '#00695C' },
  customerItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  // itemRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingVertical: 2,
  // },
  // itemRowS: {
  //   // flexDirection: 'row',
  //   // justifyContent: 'space-between',
  //   paddingVertical: 2,
  // },
  // itemName: {
  //   fontSize: 16,
  //   backgroundColor: '#fff',
  // },
  // itemPrice: {
  //   fontSize: 14,
  //   fontWeight: 'bold',
  // },
  // itemDetails: {
  //   margin: 8,
  // },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 5,
    borderRadius: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemRowS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#00695C',
  },

  removeIcon: {
    paddingLeft: 10,
    justifyContent: 'center',
  },

});

export default CreateSalesScreen;
