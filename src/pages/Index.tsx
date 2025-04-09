
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowRight, Utensils, Share2, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Recipe } from "@/types";
import { getRecipes } from "@/api/recipes";
import { RecipeCard } from "@/components/RecipeCard";
import { getCurrentUser } from "@/api/auth";

export default function Index() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
    
    const loadFeaturedRecipes = async () => {
      try {
        const recipes = await getRecipes();
        setFeaturedRecipes(recipes.slice(0, 3)); // Show just 3 featured recipes
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedRecipes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-recipe-100 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-recipe-900">
              Ваша онлайн книга рецептов
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
              Создавайте, сохраняйте и делитесь своими любимыми рецептами с друзьями и семьей. RecipeBook - идеальный помощник для любого кулинара!
            </p>
            <div className="flex flex-wrap gap-4">
              {!isLoggedIn ? (
                <>
                  <Button asChild size="lg" className="bg-recipe-600 hover:bg-recipe-700">
                    <Link to="/register">Начать бесплатно</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Войти</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-recipe-600 hover:bg-recipe-700">
                    <Link to="/recipes/new">Создать рецепт</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/my-recipes">Мои рецепты</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1000" 
                alt="Cooking" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-recipe-900">Избранные рецепты</h2>
            <Button asChild variant="ghost" className="text-recipe-600">
              <Link to="/recipes" className="flex items-center gap-1">
                Все рецепты <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Пока нет рецептов</h3>
              <p className="text-gray-500 mb-6">Будьте первым, кто добавит рецепт!</p>
              {isLoggedIn && (
                <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                  <Link to="/recipes/new">Создать рецепт</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-recipe-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-recipe-900">Возможности RecipeBook</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-recipe-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={32} className="text-recipe-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-recipe-800">Управление рецептами</h3>
              <p className="text-gray-600">Создавайте, редактируйте и организуйте свои рецепты по категориям. Добавляйте фотографии к каждому блюду.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-recipe-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 size={32} className="text-recipe-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-recipe-800">Делитесь с близкими</h3>
              <p className="text-gray-600">С легкостью делитесь своими кулинарными шедеврами в социальных сетях или отправляйте прямую ссылку.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-recipe-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet size={32} className="text-recipe-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-recipe-800">Генерация отчетов</h3>
              <p className="text-gray-600">Создавайте и экспортируйте отчеты по рецептам в различных форматах (XLS, XLSX, PDF).</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <ChefHat size={48} className="mx-auto text-recipe-600 mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-recipe-900">Готовы начать кулинарное путешествие?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам кулинаров, которые уже используют RecipeBook для хранения своих любимых рецептов.
          </p>
          {!isLoggedIn ? (
            <Button asChild size="lg" className="bg-recipe-600 hover:bg-recipe-700">
              <Link to="/register">Создать аккаунт</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-recipe-600 hover:bg-recipe-700">
              <Link to="/recipes/new">Создать рецепт</Link>
            </Button>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
