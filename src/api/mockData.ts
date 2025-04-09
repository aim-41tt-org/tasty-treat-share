
// Mock data for the application
import { Category, Recipe, User } from '@/types';

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'recipe_book_users',
  CATEGORIES: 'recipe_book_categories',
  RECIPES: 'recipe_book_recipes',
};

// Initialize mock categories if they don't exist
export function initializeMockData() {
  // Initialize categories
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    const initialCategories: Category[] = [
      {
        id: 'cat-1',
        name: 'Завтраки',
        description: 'Блюда для утреннего приема пищи'
      },
      {
        id: 'cat-2',
        name: 'Супы',
        description: 'Первые блюда'
      },
      {
        id: 'cat-3',
        name: 'Десерты',
        description: 'Сладкие блюда'
      },
      {
        id: 'cat-4',
        name: 'Салаты',
        description: 'Холодные закуски'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }

  // Initialize recipes (empty array if none exist)
  if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify([]));
  }
}
