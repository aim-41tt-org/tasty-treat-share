
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
    const recipesJson = localStorage.getItem(STORAGE_KEYS.RECIPES);
    const recipes = recipesJson ? JSON.parse(recipesJson) : [];
    
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
    
    // Prepare report data based on format
    if (filteredRecipes.length === 0) {
      throw new Error('No recipes found for selected criteria');
    }

    // Create a report content based on the format
    let content = '';
    
    if (params.format === 'pdf') {
      content = createPDFContent(filteredRecipes);
    } else {
      content = createSpreadsheetContent(filteredRecipes);
    }
    
    // Generate a blob based on the format
    const blob = new Blob([content], { type: getFileType(params.format) });
    return blob;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

function createPDFContent(recipes: Recipe[]): string {
  // Create a simple PDF representation
  let content = 'RECIPE REPORT\n\n';
  
  recipes.forEach((recipe: Recipe, index) => {
    content += `RECIPE #${index + 1}\n`;
    content += `Title: ${recipe.title}\n`;
    content += `Description: ${recipe.description}\n`;
    content += `Cooking Time: ${recipe.cookingTime} minutes\n`;
    content += `Servings: ${recipe.servings}\n`;
    content += `Difficulty: ${recipe.difficulty}\n`;
    content += `Ingredients:\n${recipe.ingredients.join('\n')}\n`;
    content += `Instructions:\n${recipe.instructions}\n\n`;
    content += '---------------------------------------------\n\n';
  });
  
  return content;
}

function createSpreadsheetContent(recipes: Recipe[]): string {
  // Create a simple CSV-like format for spreadsheets
  let rows = [];
  
  // Header row
  rows.push(['Title', 'Description', 'Cooking Time', 'Servings', 'Difficulty', 'Ingredients', 'Instructions'].join(','));
  
  // Data rows
  recipes.forEach((recipe: Recipe) => {
    const row = [
      `"${recipe.title.replace(/"/g, '""')}"`, // Escape quotes in CSV
      `"${recipe.description.replace(/"/g, '""')}"`,
      recipe.cookingTime,
      recipe.servings,
      `"${recipe.difficulty}"`,
      `"${recipe.ingredients.join('; ').replace(/"/g, '""')}"`,
      `"${recipe.instructions.replace(/"/g, '""')}"`
    ];
    
    rows.push(row.join(','));
  });
  
  return rows.join('\n');
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
      return 'application/vnd.ms-excel';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'text/plain';
  }
}
