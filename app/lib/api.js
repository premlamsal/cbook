import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.1.70:8000/api', // Replace with your Laravel API URL
});

// Attach token to requests if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token'); // Await token retrieval
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
