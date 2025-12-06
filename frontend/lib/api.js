// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  signup: (userData) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// User API
export const userAPI = {
  getData: (email) => apiCall(`/api/user/data?email=${encodeURIComponent(email)}`),
  
  updateData: (email, data) => apiCall('/api/user/data', {
    method: 'PUT',
    body: JSON.stringify({ email, data }),
  }),
};

// Usage API
export const usageAPI = {
  record: (email) => apiCall('/api/usage/record', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  check: (email) => apiCall(`/api/usage/check?email=${encodeURIComponent(email)}`),
};

export default apiCall;
