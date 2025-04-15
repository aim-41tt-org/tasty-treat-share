
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/api/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useTheme();
  
  // For category creation
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  
  // For category editing
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error("Не удалось загрузить категории. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Название категории не может быть пустым");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createCategory(newCategoryName, newCategoryDescription);
      toast.success("Категория успешно создана");
      setIsCreateDialogOpen(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
      loadCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Не удалось создать категорию");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      toast.error("Название категории не может быть пустым");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateCategory(editingCategory.id, editCategoryName, editCategoryDescription);
      toast.success("Категория успешно обновлена");
      setIsEditDialogOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Не удалось обновить категорию");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast.success("Категория успешно удалена");
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Не удалось удалить категорию");
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className={`flex-grow ${isDarkMode ? 'bg-gray-900' : 'bg-recipe-50'} py-8 transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-recipe-900'}`}>Управление категориями</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-recipe-600 hover:bg-recipe-700">
                  <Plus size={16} className="mr-2" />
                  Создать категорию
                </Button>
              </DialogTrigger>
              <DialogContent className={isDarkMode ? 'dark bg-gray-800 text-gray-100 border-gray-700' : ''}>
                <DialogHeader>
                  <DialogTitle>Создать новую категорию</DialogTitle>
                  <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                    Добавьте название и описание для новой категории рецептов.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Название
                    </label>
                    <Input
                      id="name"
                      placeholder="Например: Десерты"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="recipe-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Описание
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Сладкие блюда, которые подаются после основных блюд"
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      className="recipe-input"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </Button>
                  <Button 
                    onClick={handleCreateCategory}
                    className="bg-recipe-600 hover:bg-recipe-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Создание...
                      </>
                    ) : "Создать"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Edit Category Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className={isDarkMode ? 'dark bg-gray-800 text-gray-100 border-gray-700' : ''}>
              <DialogHeader>
                <DialogTitle>Редактировать категорию</DialogTitle>
                <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                  Измените название и описание категории.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Название
                  </label>
                  <Input
                    id="edit-name"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="recipe-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Описание
                  </label>
                  <Textarea
                    id="edit-description"
                    value={editCategoryDescription}
                    onChange={(e) => setEditCategoryDescription(e.target.value)}
                    className="recipe-input"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleUpdateCategory}
                  className="bg-recipe-600 hover:bg-recipe-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : "Сохранить"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Categories Table */}
          <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow-sm overflow-hidden transition-colors duration-300`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className={`h-8 w-8 text-recipe-600 animate-spin`} />
                <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : ''}`}>Загрузка категорий...</span>
              </div>
            ) : categories.length > 0 ? (
              <div className={isDarkMode ? 'text-gray-100' : ''}>
                <Table>
                  <TableHeader className={isDarkMode ? 'bg-gray-900 border-gray-700' : ''}>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id} className={isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : ''}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(category)}
                              className={isDarkMode ? 'hover:bg-gray-700' : ''}
                            >
                              <Edit size={16} className="text-amber-500" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className={isDarkMode ? 'hover:bg-gray-700' : ''}>
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className={isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : ''}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                  <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                                    Это действие нельзя отменить. Категория "{category.name}" будет удалена.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className={isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : ''}>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>У вас пока нет категорий</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-recipe-600 hover:bg-recipe-700"
                >
                  <Plus size={16} className="mr-2" />
                  Создать первую категорию
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
