
import { Recipe } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Clock, ChefHat, BookmarkIcon, BookmarkedIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShareRecipeDialog } from './ShareRecipeDialog';
import { useState, useEffect } from 'react';
import { saveRecipe, unsaveRecipe, isRecipeSaved } from '@/api/recipes';
import { toast } from 'sonner';
import { getCurrentUser } from '@/api/auth';

interface RecipeCardProps {
  recipe: Recipe;
}

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

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image';
  
  useEffect(() => {
    const checkIfSaved = async () => {
      const savedStatus = await isRecipeSaved(recipe.id);
      setIsSaved(savedStatus);
    };
    
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
    
    checkIfSaved();
  }, [recipe.id]);
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  const handleSaveToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Пожалуйста, войдите в аккаунт, чтобы сохранять рецепты");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveRecipe(recipe.id);
        setIsSaved(false);
        toast.success("Рецепт удален из избранного");
      } else {
        await saveRecipe(recipe.id);
        setIsSaved(true);
        toast.success("Рецепт добавлен в избранное");
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast.error("Не удалось изменить статус рецепта");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="recipe-card overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={recipe.image || recipe.imageUrl || placeholderImage} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <Badge 
            className={`absolute top-2 right-2 ${getDifficultyColor(recipe.difficulty)}`}
          >
            {getDifficultyText(recipe.difficulty)}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold line-clamp-2 flex-grow">{recipe.title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto shrink-0"
              onClick={handleSaveToggle}
              disabled={isLoading}
            >
              {isSaved ? 
                <BookmarkedIcon size={18} className="text-recipe-600" /> : 
                <BookmarkIcon size={18} className="text-gray-500 hover:text-recipe-600" />
              }
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <ChefHat size={14} />
            {recipe.userName || recipe.authorName}
          </p>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground mb-2">
            {truncateText(recipe.ingredients.join(', '), 100)}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-recipe-600 hover:text-recipe-800 hover:bg-recipe-100"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 size={16} className="mr-1" />
            Поделиться
          </Button>
          <Button 
            size="sm"
            className="bg-recipe-600 hover:bg-recipe-700"
            asChild
          >
            <Link to={`/recipes/${recipe.id}`}>
              Смотреть
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <ShareRecipeDialog 
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        recipeId={recipe.id}
        recipeTitle={recipe.title}
      />
    </>
  );
}
