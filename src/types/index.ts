
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  userId: string;
  userName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ReportParams {
  type: 'user' | 'category';
  userId?: string;
  categoryId?: string;
  format: 'xlsx' | 'xls' | 'pdf';
}

export interface APIError {
  message: string;
  status: number;
}
