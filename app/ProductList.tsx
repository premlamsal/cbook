import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ProductList = () => {
  const products = [{ name: 'Product 1', sales: 500 }, { name: 'Product 2', sales: 300 },
  { name: 'Product 3', sales: 400 },
  { name: 'Product 4', sales: 500 },
  { name: 'Product 5', sales: 600 }

];

  return (
    <View style={styles.listCard}>
      <Text style={styles.title}>Low Stock Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productSales}>Stock: {item.sales}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listCard: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  product: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  productName: { fontSize: 16 },
  productSales: { fontSize: 16, color: '#888' },
});

export default ProductList;
