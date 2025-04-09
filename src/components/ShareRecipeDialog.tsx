
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Share2, Copy, Instagram, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getShareLink } from "@/api/recipes";
import { toast } from "sonner";

interface ShareRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  recipeTitle: string;
}

export function ShareRecipeDialog({ isOpen, onClose, recipeId, recipeTitle }: ShareRecipeDialogProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchShareLink();
    }
  }, [isOpen, recipeId]);

  const fetchShareLink = async () => {
    setIsLoading(true);
    try {
      const link = await getShareLink(recipeId);
      setShareUrl(link);
    } catch (error) {
      console.error('Error fetching share link:', error);
      toast.error('Не удалось получить ссылку для общего доступа');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch (error) {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const shareTo = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Посмотрите этот рецепт: ${recipeTitle}`)}`;
        break;
      case 'vk':
        url = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(recipeTitle)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        toast.info('Для Instagram скопируйте ссылку и поделитесь через приложение');
        copyToClipboard();
        return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2" size={20} />
            Поделиться рецептом
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-2">{recipeTitle}</h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              onClick={() => shareTo('facebook')} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <Facebook className="mr-2" size={18} />
              Facebook
            </Button>
            
            <Button 
              onClick={() => shareTo('twitter')} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <Twitter className="mr-2" size={18} />
              Twitter
            </Button>
            
            <Button 
              onClick={() => shareTo('vk')} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <LinkIcon className="mr-2" size={18} />
              VK
            </Button>
            
            <Button 
              onClick={() => shareTo('instagram')} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <Instagram className="mr-2" size={18} />
              Instagram
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="border rounded-md flex items-center p-2 bg-recipe-50">
                <span className="text-sm truncate flex-1">{isLoading ? 'Загрузка ссылки...' : shareUrl}</span>
              </div>
            </div>
            <Button 
              type="button" 
              size="sm" 
              className="px-3 bg-recipe-600 hover:bg-recipe-700"
              onClick={copyToClipboard}
              disabled={isLoading}
            >
              <span className="sr-only">Копировать</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
