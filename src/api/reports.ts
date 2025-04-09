
import { STORAGE_KEYS } from './mockData';
import { Recipe } from '@/types';

export interface ReportParams {
  type: 'category' | 'user';
  categoryId?: string;
  userId?: string;
  format: 'xlsx' | 'xls' | 'pdf';
}

export async function generateReport(params: ReportParams): Promise<Blob> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECIPES) || '[]');
    
    // Filter based on params
    const filteredRecipes = recipes.filter((recipe: Recipe) => {
      if (params.type === 'category' && params.categoryId) {
        return recipe.categoryId === params.categoryId;
      }
      if (params.type === 'user' && params.userId) {
        return recipe.userId === params.userId;
      }
      return false;
    });
    
    // Create a simple text representation of the data
    const reportText = filteredRecipes.map((recipe: Recipe) => {
      return `Title: ${recipe.title}\nDescription: ${recipe.description}\nCooking time: ${recipe.cookingTime} min\nDifficulty: ${recipe.difficulty}\nIngredients: ${recipe.ingredients.join(', ')}\nInstructions: ${recipe.instructions}\n\n`;
    }).join('---\n\n');
    
    // Generate a mock blob based on the format
    const blob = new Blob([reportText], { type: getFileType(params.format) });
    return blob;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

export function downloadReport(blob: Blob, fileName: string): void {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getFileType(format: string): string {
  switch (format) {
    case 'xlsx':
    case 'xls':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'text/plain';
  }
}
