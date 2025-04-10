
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Recipe } from "@/types";
import { getRecipes } from "@/api/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/api/auth";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const allRecipes = await getRecipes();
        // Фильтруем рецепты, оставляя только те, что принадлежат текущему пользователю
        if (currentUser) {
          const userRecipes = allRecipes.filter(recipe => recipe.userId === currentUser.id);
          setRecipes(userRecipes);
        } else {
          // Если пользователь не авторизован, показываем пустой список
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
        toast.error("Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipes();
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-recipe-100 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-recipe-900">Мои рецепты</h1>
              <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                <Link to="/recipes/new" className="flex items-center gap-2">
                  <Plus size={16} />
                  Добавить рецепт
                </Link>
              </Button>
            </div>
            
            {!currentUser ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Пожалуйста, войдите в аккаунт</h3>
                <p className="text-gray-500 mb-6">Чтобы увидеть свои рецепты, вам необходимо авторизоваться</p>
                <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                  <Link to="/login">Войти</Link>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-recipe-600 animate-spin mb-4" />
                <p className="text-gray-500">Загрузка рецептов...</p>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">У вас пока нет рецептов</h3>
                <p className="text-gray-500 mb-6">Создайте свой первый рецепт, нажав на кнопку "Добавить рецепт"</p>
                <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                  <Link to="/recipes/new" className="flex items-center gap-2">
                    <Plus size={16} />
                    Добавить рецепт
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
