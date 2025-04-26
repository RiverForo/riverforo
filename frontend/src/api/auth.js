// frontend/src/api/auth.js
import API_BASE_URL from '../config/api';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // this will allow cookies if needed
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
