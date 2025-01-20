import React from 'react';
import { ScrollView, View, Text,StatusBar, SafeAreaView,StyleSheet, TouchableHighlight } from 'react-native';
import SalesStats from '../SalesStats';
import PurchaseStats from '../PurchaseStats';
import ProductList from '../ProductList';

// import ProductList from '../ProductList';
const DashboardScreen = () => {
  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor={'#00695C'} barStyle={'light-content'} translucent={true} /> 
      {/* <Text style={styles.header}>Dashboard</Text> */}
      <SafeAreaView> 
      <SalesStats />
      <PurchaseStats />
      {/* <ProductList /> */}

      <View>
          {/* <View style={styles.dashBoxContainer}> */}
           {/* <View style={styles.dashBox}>
              <Text style={styles.dashBoxTextWhite}>Category</Text>
           </View> */}
           {/* <View style={styles.dashBox}>
           <Text style={styles.dashBoxTextWhite}>Products</Text>
           </View> */}
         
          {/* </View> */}
          
          {/* <View style={styles.dashBoxContainer}>
            <View style={styles.dashBox}>
              <Text style={styles.dashBoxTextWhite}>Customers</Text>
            </View>
            <View style={styles.dashBox}>
              <Text style={styles.dashBoxTextWhite}>Suppliers</Text>
            </View>
          </View> */}
          <View style={{marginTop:10}}>
<ProductList/>
          </View>
      </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,  padding:10,backgroundColor: '#f2f2f2' ,paddingBottom:100},
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  dashBoxContainer:{
    // backgroundColor:'#B1B2FF',
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
   
  },
 
  dashBox:{
    backgroundColor:'#009688',
    padding:3,
    borderRadius: 8,
    height:120,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    margin:3,
    shadowColor:'#333',
    borderColor:'#009688',
    borderWidth:1,
  },
 

  dashBoxTextBlack:{
    color:'#333',
    fontSize:16,
    // textTransform:'uppercase'
  },
  dashBoxTextWhite:{
    color:'#fff',
    fontSize:16,
    // textTransform:'uppercase'
  }
  
});

export default DashboardScreen;
