import axios from 'axios';

// Base API configuration for Express backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: add auth token or custom headers if available
apiClient.interceptors.request.use(
  (config) => {
    // If JWT token exists in localStorage, attach to Authorization header
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalizedMessage = 'An unexpected network error occurred.';

    if (error.response) {
      // Backend returned a response with an error code (4xx, 5xx)
      const data = error.response.data;
      normalizedMessage = data?.message || data?.error || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response received (Express server not running or CORS blocked)
      normalizedMessage = 'Unable to connect to the Express backend. Operating in local storage mode.';
    } else {
      normalizedMessage = error.message;
    }

    return Promise.reject({
      ...error,
      userMessage: normalizedMessage,
      isNetworkError: !error.response,
    });
  }
);

export default apiClient;
