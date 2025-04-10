
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getRecipeById } from "@/api/recipes";
import { Recipe } from "@/types";
import { Clock, ChefHat, Users, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShareRecipeDialog } from "@/components/ShareRecipeDialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Helper to convert difficulty to Russian
const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    'easy': 'Легкий',
    'medium': 'Средний',
    'hard': 'Сложный'
  };
  return map[difficulty] || difficulty;
};

// Helper to get appropriate color for difficulty
const getDifficultyColor = (difficulty: string) => {
  const map: Record<string, string> = {
    'easy': 'bg-green-100 text-green-800',
    'medium': 'bg-amber-100 text-amber-800',
    'hard': 'bg-red-100 text-red-800'
  };
  return map[difficulty] || 'bg-gray-100 text-gray-800';
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
      } catch (error) {
        console.error("Error loading recipe:", error);
        toast.error("Не удалось загрузить рецепт. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const placeholderImage = 'https://via.placeholder.com/800x400?text=No+Image';

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-recipe-50 py-10">
          <div className="container mx-auto px-4 flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-recipe-600 animate-spin mr-2" />
            <span className="text-xl text-gray-600">Загрузка рецепта...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-recipe-50 py-10">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Рецепт не найден</h1>
            <p className="text-gray-600 mb-6">Запрашиваемый рецепт не существует или был удален.</p>
            <Button asChild className="bg-recipe-600 hover:bg-recipe-700">
              <a href="/recipes">Вернуться к списку рецептов</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-recipe-50 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-96">
              <img 
                src={recipe.image || recipe.imageUrl || placeholderImage} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-4 right-4 ${getDifficultyColor(recipe.difficulty)} text-sm px-3 py-1`}
              >
                {getDifficultyText(recipe.difficulty)}
              </Badge>
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-recipe-900">{recipe.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <ChefHat size={20} className="mr-2 text-recipe-600" />
                  <span>{recipe.authorName || recipe.userName || "Аноним"}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={20} className="mr-2 text-recipe-600" />
                  <span>{recipe.cookingTime} мин.</span>
                </div>
                
                <div className="flex items-center">
                  <Users size={20} className="mr-2 text-recipe-600" />
                  <span>{recipe.servings} порций</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-8">{recipe.description}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-recipe-800">Ингредиенты</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-recipe-800">Инструкции</h2>
                <div className="text-gray-700 prose">
                  {recipe.instructions.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 size={16} className="mr-2" />
                  Поделиться рецептом
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {recipe && (
        <ShareRecipeDialog 
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          recipeId={recipe.id}
          recipeTitle={recipe.title}
        />
      )}
    </div>
  );
}
