
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { getCurrentUser } from '@/api/auth';
import { User } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  // Получаем состояние темы и функцию переключения из контекста
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    notifications: {
      email: true,
      app: true,
      newRecipes: true,
      comments: false,
    },
    preferences: {
      defaultLanguage: 'ru',
    }
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setFormData(prev => ({
      ...prev,
      name: currentUser.name || '',
      email: currentUser.email || '',
      username: currentUser.username || '',
    }));
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (key: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // В реальном приложении здесь был бы API-запрос для обновления настроек
      // Имитируем успешное обновление после небольшой задержки
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Обновляем данные пользователя в локальном хранилище
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          username: formData.username,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      toast.success('Настройки успешно сохранены');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Настройки профиля</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Боковое меню на десктопах */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle>Разделы</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button className="text-left px-4 py-3 bg-secondary/50 font-medium">
                    Профиль
                  </button>
                  <button className="text-left px-4 py-3 hover:bg-secondary/50 text-muted-foreground">
                    Уведомления
                  </button>
                  <button className="text-left px-4 py-3 hover:bg-secondary/50 text-muted-foreground">
                    Безопасность
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Основной контент */}
          <div className="md:col-span-2">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                  <CardDescription>
                    Обновите свою личную информацию и настройки аккаунта
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input 
                      id="name"
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Ваше имя"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input 
                      id="username"
                      name="username" 
                      value={formData.username} 
                      onChange={handleInputChange} 
                      placeholder="Имя пользователя"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="Email адрес"
                    />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium">Уведомления</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="font-medium">Email уведомления</Label>
                        <p className="text-sm text-muted-foreground">Получать уведомления по email</p>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={formData.notifications.email}
                        onCheckedChange={() => handleNotificationToggle('email')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="appNotifications" className="font-medium">Уведомления в приложении</Label>
                        <p className="text-sm text-muted-foreground">Получать push-уведомления</p>
                      </div>
                      <Switch 
                        id="appNotifications" 
                        checked={formData.notifications.app}
                        onCheckedChange={() => handleNotificationToggle('app')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newRecipesNotifications" className="font-medium">Новые рецепты</Label>
                        <p className="text-sm text-muted-foreground">Уведомлять о новых рецептах</p>
                      </div>
                      <Switch 
                        id="newRecipesNotifications" 
                        checked={formData.notifications.newRecipes}
                        onCheckedChange={() => handleNotificationToggle('newRecipes')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="commentsNotifications" className="font-medium">Комментарии</Label>
                        <p className="text-sm text-muted-foreground">Уведомлять о новых комментариях</p>
                      </div>
                      <Switch 
                        id="commentsNotifications" 
                        checked={formData.notifications.comments}
                        onCheckedChange={() => handleNotificationToggle('comments')}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-medium">Настройки приложения</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="darkMode" className="font-medium">Темная тема</Label>
                        <p className="text-sm text-muted-foreground">Включить темную тему интерфейса</p>
                      </div>
                      <Switch 
                        id="darkMode" 
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Отмена
                  </Button>
                  <Button type="submit" className="bg-recipe-600 hover:bg-recipe-700" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
