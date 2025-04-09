
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

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

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
    const matchesCategory = selectedCategory ? recipe.categoryId === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? recipe.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-recipe-100 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-recipe-900">Все рецепты</h1>
              <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
                <Link to="/recipes/new" className="flex items-center gap-2">
                  <Plus size={16} />
                  Добавить рецепт
                </Link>
              </Button>
            </div>
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
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
                    <SelectItem value="">Все категории</SelectItem>
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
                    <SelectItem value="">Все уровни</SelectItem>
                    <SelectItem value="easy">Легкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="hard">Сложный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchTerm || selectedCategory || selectedDifficulty) && (
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
            
            {/* Recipe Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-recipe-600 animate-spin mb-4" />
                <p className="text-gray-500">Загрузка рецептов...</p>
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Рецепты не найдены</h3>
                <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска или сбросить фильтры</p>
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
