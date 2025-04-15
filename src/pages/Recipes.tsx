
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Recipe, Category } from "@/types";
import { getRecipes } from "@/api/recipes";
import { getCategories } from "@/api/categories";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus, Search, FilterX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const [recipesData, categoriesData] = await Promise.all([
          getRecipes(),
          getCategories()
        ]);
        setRecipes(recipesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error("Не удалось загрузить рецепты. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : recipe.categoryId === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" ? true : recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className="flex-grow">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-recipe-100'} py-10 transition-colors duration-300`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-recipe-900'}`}>Все рецепты</h1>
              <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                <Link to="/recipes/new" className="flex items-center gap-2">
                  <Plus size={16} />
                  Добавить рецепт
                </Link>
              </Button>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg shadow-sm mb-8 transition-colors duration-300`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Поиск рецептов..."
                    className="pl-10 recipe-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="recipe-input">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="recipe-input">
                    <SelectValue placeholder="Уровень сложности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="easy">Легкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="hard">Сложный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center gap-1"
                  >
                    <FilterX size={14} />
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-recipe-600 animate-spin mb-4" />
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Загрузка рецептов...</p>
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Рецепты не найдены</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex items-center gap-1"
                >
                  <FilterX size={14} />
                  Сбросить фильтры
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
