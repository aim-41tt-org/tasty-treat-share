
import { AuthResponse, User } from '@/types';

const API_URL = 'https://api.recipebook.example'; // Replace with actual API URL when available

export async function register(name: string, username: string, password: string, email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    return response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  // Clear token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuth(authResponse: AuthResponse): void {
  localStorage.setItem('token', authResponse.token);
  localStorage.setItem('user', JSON.stringify(authResponse.user));
}
