// API Configuration
const getApiUrl = () => {
  // In production/Docker, use the backend service
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'http://backend:5000';
  }
  
  // In development, use localhost
  return process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
};

export const API_BASE_URL = getApiUrl();
