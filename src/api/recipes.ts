
import { Recipe } from '@/types';
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

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export async function getUserRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_URL}/recipes/my`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user recipes');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    throw error;
  }
}

export async function getRecipeById(id: string): Promise<Recipe> {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating recipe ${id}:`, error);
    throw error;
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
}

export async function uploadRecipeImage(recipeId: string, file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/recipes/${recipeId}/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading recipe image:', error);
    throw error;
  }
}

export async function getShareLink(recipeId: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/share`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to generate share link');
    }

    const data = await response.json();
    return data.shareUrl;
  } catch (error) {
    console.error('Error generating share link:', error);
    throw error;
  }
}
