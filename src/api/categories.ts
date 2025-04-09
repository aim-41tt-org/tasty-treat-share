
import { Category } from '@/types';
import { getAuthToken } from './auth';
import { STORAGE_KEYS, initializeMockData } from './mockData';

// Initialize mock data
initializeMockData();

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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock purposes, retrieve from localStorage
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current categories
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    
    // Create new category
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      description
    };
    
    // Add to "database"
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, name: string, description?: string): Promise<Category> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current categories
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    
    // Find category by id
    const index = categories.findIndex((cat: Category) => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    // Update category
    const updatedCategory = {
      ...categories[index],
      name,
      description
    };
    
    categories[index] = updatedCategory;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    
    return updatedCategory;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current categories
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    
    // Filter out the category
    const updatedCategories = categories.filter((cat: Category) => cat.id !== id);
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
}
