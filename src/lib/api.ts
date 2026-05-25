import axios from 'axios';

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const AsyncStorage = (
    await import('@react-native-async-storage/async-storage')
  ).default;
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
