import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PurchaseStats = () => {
  return (
    <View style={styles.statsCard}>
      <Text style={styles.title}>Purchase</Text>
      <Text style={styles.stat}>Total Purchases: 800</Text>
      <Text style={styles.stat}>Expenditure: $20,000</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: { padding: 16, 
    backgroundColor: '#fff',
    // borderColor:'#00695C',
    // borderWidth:1,
      borderRadius: 8, marginBottom: 0, },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 ,color:'#00695C'},
  stat: { fontSize: 16, color: 'grey' },
});

export default PurchaseStats;
