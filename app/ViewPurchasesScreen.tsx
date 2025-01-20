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

const ViewPurchasesScreen = () => {
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');

    const [supplierName, setSupplierName] = useState('');
    const [supplierId, setSupplierId] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const route = useRoute();

    const [subTotal, setSubTotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);


    const [purchaseItems, setPurchaseItems] = useState([]);

    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();

    const { purchaseId } = route.params || {}; // Get the productId from the navigation route

    useEffect(() => {
        if (!purchaseId) return; // Ensure purchaseId is available
        fetchPurchases(purchaseId);

        // Fetch suppliers from the API
        api.get('/suppliers')
            .then(response => setSuppliers(response.data))
            .catch(error => console.error('Error fetching suppliers:', error));

        // Fetch purchase data in edit mode

        // Set the navigation title
        navigation.setOptions({
            headerTitle: purchaseId ? 'View Purchases' : 'View Purchases',
        });

    }, [purchaseId]);


    const fetchPurchases = async (id) => {
        try {
            const response = await api.get(`/purchases/${id}`);
            const purchaseData = response.data;
            const purchaseDataItems = response.data.details;
            handleSupplierSelect(purchaseData.supplier);
            setPurchaseDate(purchaseData.purchase_date ? new Date(purchaseData.purchase_date) : new Date());
            setDueDate(purchaseData.due_date ? new Date(purchaseData.due_date) : new Date());

            const tempPurchaseItems = purchaseDataItems.map(item => ({
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
            setPurchaseItems(tempPurchaseItems);


            console.log(tempPurchaseItems)

        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    // Fetch suppliers suggestions
    const fetchSuppliers = async (query) => {
        setLoading(true);
        try {
            const response = await api.get(`/suppliers?search=${query}`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce API calls to minimize server hits
    const debouncedFetchSuppliers = useCallback(debounce(fetchSuppliers, 500), []);

    const handleTextChange = (text) => {
        setSupplierName(text);
        setShowSuggestions(true);
        debouncedFetchSuppliers(text);
    };

    const handleSupplierSelect = (supplier) => {
        setSupplierId(supplier.id); // Set selected supplier name
        setSupplierName(supplier.name); // Set selected supplier name
        setShowSuggestions(false); // Hide suggestions
    };


    const subtotal = purchaseItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    );

    const tax = subtotal * 0.13;
    const grandTotal = subtotal + tax;


    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <TouchableOpacity onPress={savePurchase}>
    //                 <MaterialIcons name="check" size={25} color="#fff" />
    //             </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation, savePurchase]);



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
            setPurchaseDate(currentDate);
        } else {
            setDueDate(currentDate);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: headerHeight }]}>
            <View style={[styles.purchaseDetails, { position: 'relative' }]}>
                <TextInput
                    mode="flat"
                    style={styles.input}
                    label="Supplier"
                    value={supplierName}
                    editable={false}
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
                                data={suppliers}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#fafafa' }}
                                        onPress={() => handleSupplierSelect(item)}
                                    >
                                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginTop: 0 }}>
                <View style={{ width: '49%' }}>
                    <View style={{ margin: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Purchase Date</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 5 }}>{purchaseDate.toLocaleDateString()}</Text>
                            <MaterialIcons name="calendar-today" size={20} color="#00695C" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ width: '49%' }}>
                    <View style={{ margin: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Due Date</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    value={mode === 'date' ? purchaseDate : dueDate}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}

            <View style={styles.itemDetails}>
                <View style={{ margin: 5, marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.itemDetailsText}>Item Details</Text>



                </View>
                <FlatList
                    style={{ height: 426, borderRadius: 30 }}
                    data={purchaseItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ padding: 16, backgroundColor: '#fff', marginTop: 5, flex: 1 }}>
                            <TouchableOpacity

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
                                    {/* <TouchableOpacity onPress={() => handleRemoveItem(item.id)} >
                                        <MaterialIcons name="delete" size={24} color="#FF3B30" />
                                    </TouchableOpacity> */}
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
    purchaseDetails: { margin: 5 },
    itemDetails: { margin: 5 },
    itemDetailsText: { fontSize: 10, color: '#00695C', textTransform: 'uppercase', letterSpacing: 4, textAlign: 'center' },
    subTotalAmount: { padding: 5, flexDirection: 'row', justifyContent: 'space-between' },
    totalText: { color: '#fff', fontSize: 14 },
    totalValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    totalAmount: { padding: 5, flexDirection: 'row', justifyContent: 'space-between' },
    buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 5, backgroundColor: '#00695C' },
    supplierItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },

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

export default ViewPurchasesScreen;
