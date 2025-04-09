
import { Category } from '@/types';
import { getAuthToken } from './auth';

const API_URL = 'https://api.recipebook.example'; // Replace with actual API URL when available

// Helper function to include auth token
const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, name: string, description?: string): Promise<Category> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
}
