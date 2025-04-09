
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Category, User } from "@/types";
import { getCategories } from "@/api/categories";
import { getCurrentUser } from "@/api/auth";
import { generateReport, downloadReport } from "@/api/reports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";

export default function Reports() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'user' | 'category'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<'xlsx' | 'xls' | 'pdf'>('xlsx');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        const user = getCurrentUser();
        setCurrentUser(user);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error("Не удалось загрузить необходимые данные");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      const reportParams = {
        type: selectedType,
        categoryId: selectedType === 'category' ? selectedCategory : undefined,
        userId: selectedType === 'user' ? currentUser?.id : undefined,
        format: selectedFormat
      };
      
      const reportBlob = await generateReport(reportParams);
      
      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const reportType = selectedType === 'category' ? 'category' : 'user';
      const reportFormat = selectedFormat;
      const fileName = `recipes-${reportType}-${date}.${reportFormat}`;
      
      downloadReport(reportBlob, fileName);
      
      toast.success("Отчет успешно сгенерирован");
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Не удалось сгенерировать отчет");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-recipe-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-recipe-900">Генерация отчетов</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Параметры отчета</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-recipe-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Тип отчета</label>
                      <Select
                        value={selectedType}
                        onValueChange={(value) => setSelectedType(value as 'user' | 'category')}
                      >
                        <SelectTrigger className="recipe-input">
                          <SelectValue placeholder="Выберите тип отчета" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">По категории</SelectItem>
                          <SelectItem value="user">По пользователю</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedType === 'category' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Категория</label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                          disabled={categories.length === 0}
                        >
                          <SelectTrigger className="recipe-input">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {categories.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            Нет доступных категорий. Создайте категорию, прежде чем генерировать отчет.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {selectedType === 'user' && currentUser && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Пользователь</label>
                        <div className="p-2 border rounded bg-muted">
                          {currentUser.name} ({currentUser.username})
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Формат файла</label>
                      <Select
                        value={selectedFormat}
                        onValueChange={(value) => setSelectedFormat(value as 'xlsx' | 'xls' | 'pdf')}
                      >
                        <SelectTrigger className="recipe-input">
                          <SelectValue placeholder="Выберите формат" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xlsx">
                            <div className="flex items-center">
                              <FileSpreadsheet size={14} className="mr-2" />
                              XLSX
                            </div>
                          </SelectItem>
                          <SelectItem value="xls">
                            <div className="flex items-center">
                              <FileSpreadsheet size={14} className="mr-2" />
                              XLS
                            </div>
                          </SelectItem>
                          <SelectItem value="pdf">
                            <div className="flex items-center">
                              <FileText size={14} className="mr-2" />
                              PDF
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={handleGenerateReport}
                      className="w-full bg-recipe-600 hover:bg-recipe-700 mt-4"
                      disabled={
                        isGenerating || 
                        (selectedType === 'category' && !selectedCategory) || 
                        (categories.length === 0 && selectedType === 'category')
                      }
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        "Сгенерировать отчет"
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>О генерации отчетов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  В этом разделе вы можете создавать отчеты о рецептах двух типов:
                </p>
                
                <div className="space-y-4 mt-4">
                  <div className="bg-recipe-100 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Отчет по категории</h3>
                    <p className="text-sm">
                      Получите список всех рецептов в выбранной категории с подробной информацией о каждом рецепте (название, автор, ингредиенты, инструкции).
                    </p>
                  </div>
                  
                  <div className="bg-recipe-100 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Отчет по пользователю</h3>
                    <p className="text-sm">
                      Сформируйте список всех ваших рецептов с полной информацией о каждом из них.
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Все отчеты можно скачать в удобном для вас формате (XLSX, XLS или PDF) для дальнейшего использования или печати.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
