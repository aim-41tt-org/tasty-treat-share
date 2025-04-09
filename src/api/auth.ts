
import { AuthResponse, User } from '@/types';

const API_URL = 'https://api.recipebook.example'; // Replace with actual API URL when available

// Simulated local storage for demo purposes
const LOCAL_USERS = 'recipe_book_users';

/**
 * Registers a new user and simulates API response
 */
export async function register(name: string, username: string, password: string, email: string): Promise<AuthResponse> {
  // For demo purposes, check if username exists in local storage
  const existingUsers = JSON.parse(localStorage.getItem(LOCAL_USERS) || '[]');
  const userExists = existingUsers.some((user: User) => user.username === username || user.email === email);
  
  if (userExists) {
    throw new Error('Пользователь с таким логином или email уже существует');
  }

  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    username,
    email,
  };

  // Add user to "database"
  existingUsers.push(newUser);
  localStorage.setItem(LOCAL_USERS, JSON.stringify(existingUsers));

  // Create auth response with token
  const authResponse: AuthResponse = {
    user: newUser,
    token: `demo-token-${Date.now()}`
  };

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Save auth data
  setAuth(authResponse);
  
  return authResponse;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  // For demo purposes, check if user exists in local storage
  const existingUsers = JSON.parse(localStorage.getItem(LOCAL_USERS) || '[]');
  const user = existingUsers.find((u: User) => u.username === username);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  // Create auth response
  const authResponse: AuthResponse = {
    user,
    token: `demo-token-${Date.now()}`
  };
  
  // Save auth data
  setAuth(authResponse);
  
  return authResponse;
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
