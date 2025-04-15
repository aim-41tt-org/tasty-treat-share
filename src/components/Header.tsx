
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { User as UserType } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat size={30} className="text-recipe-600" />
          <span className="text-2xl font-bold text-recipe-800">RecipeBook</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/recipes" className="text-foreground hover:text-recipe-600 transition-colors">
            Рецепты
          </Link>
          {user && (
            <>
              <Link to="/my-recipes" className="text-foreground hover:text-recipe-600 transition-colors">
                Мои рецепты
              </Link>
              <Link to="/saved-recipes" className="text-foreground hover:text-recipe-600 transition-colors">
                Сохраненные
              </Link>
              <Link to="/reports" className="text-foreground hover:text-recipe-600 transition-colors">
                Отчеты
              </Link>
              <Link to="/categories" className="text-foreground hover:text-recipe-600 transition-colors">
                Категории
              </Link>
            </>
          )}
        </nav>
        
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User size={16} />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Войти
              </Button>
              <Button 
                size="sm"
                className="bg-recipe-600 hover:bg-recipe-700 text-white"
                onClick={() => navigate('/register')}
              >
                Регистрация
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
