
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Recipe } from "@/types";
import { getRecipes } from "@/api/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookmarkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/api/auth";
import { useTheme } from "@/contexts/ThemeContext";

const SAVED_RECIPES_KEY = "saved-recipes";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        setIsLoading(true);
        
        // Получаем ID сохраненных рецептов из localStorage
        const savedRecipeIds = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || '[]');
        
        if (savedRecipeIds.length === 0) {
          setRecipes([]);
          setIsLoading(false);
          return;
        }
        
        // Загружаем все рецепты
        const allRecipes = await getRecipes();
        
        // Фильтруем только сохраненные
        const savedRecipes = allRecipes.filter(recipe => 
          savedRecipeIds.includes(recipe.id)
        );
        
        setRecipes(savedRecipes);
      } catch (error) {
        console.error("Error loading saved recipes:", error);
        toast.error("Не удалось загрузить сохраненные рецепты. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedRecipes();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className="flex-grow">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-recipe-100'} py-10 transition-colors duration-300`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-recipe-900'}`}>Сохраненные рецепты</h1>
              <Button asChild variant="outline">
                <Link to="/recipes" className="flex items-center gap-2">
                  Все рецепты
                </Link>
              </Button>
            </div>
            
            {!currentUser ? (
              <div className={`text-center py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Пожалуйста, войдите в аккаунт</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Чтобы увидеть сохраненные рецепты, вам необходимо авторизоваться</p>
                <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                  <Link to="/login">Войти</Link>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-recipe-600 animate-spin mb-4" />
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Загрузка рецептов...</p>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>У вас нет сохраненных рецептов</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Перейдите в каталог рецептов и добавьте понравившиеся рецепты в избранное</p>
                <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                  <Link to="/recipes">
                    Перейти к рецептам
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
