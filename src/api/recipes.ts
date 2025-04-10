
import { Recipe, RecipeCreateData } from '@/types';
import { getAuthToken } from './auth';
import { STORAGE_KEYS, initializeMockData } from './mockData';

// Initialize mock data
initializeMockData();

// Константа для сохраненных рецептов
const SAVED_RECIPES_KEY = "saved-recipes";

export async function getRecipes(): Promise<Recipe[]> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock purposes, retrieve from localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getRecipeById(id: string): Promise<Recipe> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock purposes, retrieve from localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    const recipe = recipes.find((r: Recipe) => r.id === id);
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    return recipe;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
}

export async function createRecipe(recipeData: RecipeCreateData): Promise<Recipe> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get current user from auth
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // For mock purposes, save to localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    
    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      userId: user.id || 'anonymous',
      authorName: user.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...recipeData
    };
    
    recipes.push(newRecipe);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    
    return newRecipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

export async function updateRecipe(id: string, recipeData: Partial<RecipeCreateData>): Promise<Recipe> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock purposes, update in localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    const index = recipes.findIndex((r: Recipe) => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    const updatedRecipe = {
      ...recipes[index],
      ...recipeData,
      updatedAt: new Date().toISOString()
    };
    
    recipes[index] = updatedRecipe;
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    
    return updatedRecipe;
  } catch (error) {
    console.error(`Error updating recipe ${id}:`, error);
    throw error;
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For mock purposes, delete from localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    const updatedRecipes = recipes.filter((r: Recipe) => r.id !== id);
    
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
}

// Функция для получения ссылки для шаринга
export async function getShareLink(recipeId: string): Promise<string> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a shareable link (in a real app, this might involve creating a short URL or specific share token)
    // For our mock implementation, we'll just use the current domain + recipe path
    const baseUrl = window.location.origin;
    return `${baseUrl}/recipes/${recipeId}`;
  } catch (error) {
    console.error(`Error generating share link for recipe ${recipeId}:`, error);
    throw error;
  }
}

// Функция для загрузки изображения рецепта
export async function uploadRecipeImage(recipeId: string, imageFile: File): Promise<string> {
  try {
    // Simulate network delay for file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would upload to a CDN or server
    // For our mock implementation, we'll create a data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Функция для сохранения рецепта в избранное
export async function saveRecipe(recipeId: string): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Получаем текущий список сохраненных рецептов
    const savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || '[]');
    
    // Проверяем, не сохранен ли уже этот рецепт
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));
    }
  } catch (error) {
    console.error(`Error saving recipe ${recipeId}:`, error);
    throw error;
  }
}

// Функция для удаления рецепта из избранного
export async function unsaveRecipe(recipeId: string): Promise<void> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Получаем текущий список сохраненных рецептов
    const savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || '[]');
    
    // Удаляем рецепт из списка
    const updatedSavedRecipes = savedRecipes.filter((id: string) => id !== recipeId);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedSavedRecipes));
  } catch (error) {
    console.error(`Error removing saved recipe ${recipeId}:`, error);
    throw error;
  }
}

// Функция для проверки, сохранен ли рецепт
export async function isRecipeSaved(recipeId: string): Promise<boolean> {
  try {
    // Получаем текущий список сохраненных рецептов
    const savedRecipes = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || '[]');
    
    // Проверяем наличие рецепта в списке
    return savedRecipes.includes(recipeId);
  } catch (error) {
    console.error(`Error checking if recipe ${recipeId} is saved:`, error);
    return false;
  }
}
