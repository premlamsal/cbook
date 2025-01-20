import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, Slot } from "expo-router";
import { useEffect, useState, createContext } from 'react';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00695C',
    secondary: 'white',
  },
};
export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization (e.g., fetching resources, authentication checks)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Display a loading screen before the app is ready
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing App...</Text>
        <Text style={styles.loadingText}>Please Wait...</Text>
      </View>
    );
  }


  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#00695C',

          },
          headerTitleStyle: {
            fontWeight: 'light',
          },


          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="ProductDetailsScreen" options={{ title: 'Product Details' }} />
        <Stack.Screen name="UnitDetailsScreen" options={{ title: 'Unit Details' }} />
        <Stack.Screen name="CategoryDetailsScreen" options={{ title: 'Category Details' }} />
        <Stack.Screen name="SupplierDetailsScreen" options={{ title: 'Supplier Details' }} />
        <Stack.Screen name="CustomerDetailsScreen" options={{ title: 'Customer Details' }} />


        <Stack.Screen name="CreateProductScreen" options={{ title: 'Create Product', gestureEnabled: false, headerTransparent: true, }} />
        <Stack.Screen name="CreateUnitScreen"

          options={{ title: 'Create Unit', gestureEnabled: false, headerTransparent: true, }}

        />
        <Stack.Screen name="CreateCategoryScreen" options={{ title: 'Create Category', gestureEnabled: false, headerTransparent: true }} />
        <Stack.Screen name="CreateSupplierScreen" options={{ title: 'Create Supplier', gestureEnabled: false, headerTransparent: true }} />
        <Stack.Screen name="CreateCustomerScreen" options={{ title: 'Create Customer', gestureEnabled: false, headerTransparent: true }} />
        <Stack.Screen name="CreateSalesScreen" options={{ title: 'Create Sales', gestureEnabled: false, headerTransparent: true }} />
        <Stack.Screen name="ViewSalesScreen" options={{ title: 'View Sales', gestureEnabled: false, headerTransparent: true }} />



        <Stack.Screen
          name="AddEditProductModal"

          options={{
            title: 'Add/Edit Invoice Product',
            presentation: 'modal',
            gestureEnabled: false, headerTransparent: true
          }}
        />


        <Stack.Screen name="CreatePurchasesScreen" options={{ title: 'Create Purchases', gestureEnabled: false, headerTransparent: true }} />
        <Stack.Screen name="ViewPurchasesScreen" options={{ title: 'View Purchases', gestureEnabled: false, headerTransparent: true }} />



        <Stack.Screen
          name="AddEditProductModalPurchases"

          options={{
            title: 'Add/Edit Purchases Product',
            presentation: 'modal',
            gestureEnabled: false, headerTransparent: true
          }}
        />


        <Stack.Screen name="ProductImagesScreen" options={{ title: 'Product Images', gestureEnabled: false, headerTransparent: true }} />


      </Stack>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
