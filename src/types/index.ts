
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeCreateData {
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  ingredients: string[];
  instructions: string;
  image?: string;
}

export interface Recipe extends RecipeCreateData {
  id: string;
  userId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  likes?: number;
}

export interface RecipeComment {
  id: string;
  recipeId: string;
  userId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface ReportData {
  type: 'category' | 'user';
  categoryId?: string;
  userId?: string;
  format: 'xlsx' | 'xls' | 'pdf';
}
