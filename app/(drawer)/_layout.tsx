import React, { createContext, useContext, useState, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';

// Layout Component
export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#00695C',
        },
        drawerLabelStyle: {

          fontSize: 16,
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#00695C',
        },
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#f2f2f2',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
        }}
      ></Drawer.Screen>

      <Drawer.Screen
        name="index"
        options={{
          title: 'Login',
        }}
      ></Drawer.Screen>

      <Drawer.Screen
        name="Register"
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Register',
          headerShown: false,
        }}
      ></Drawer.Screen>

      <Drawer.Screen
        name="Sale"
        options={{
          title: 'Sales',

        }}

      />
      <Drawer.Screen
        name="Purchase"
        options={{
          title: 'Purchase',
        }}
      />
      <Drawer.Screen
        name="Customer"
        options={{
          title: 'Customers',
        }}
      />
      <Drawer.Screen
        name="Supplier"
        options={{
          title: 'Suppliers',
        }}
      />
      <Drawer.Screen
        name="Product"
        options={{
          title: 'Products',
        }}
      />
      <Drawer.Screen
        name="Unit"
        options={{
          title: 'Units',
        }}
      />
      <Drawer.Screen
        name="Category"
        options={{
          title: 'Categories',
        }}
      />
    </Drawer>
  );
}
