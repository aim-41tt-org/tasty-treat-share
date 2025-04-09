import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/api/categories";
import { createRecipe, uploadRecipeImage } from "@/api/recipes";
import { Plus, Trash2, UploadCloud } from "lucide-react";

const ingredientSchema = z.object({
  name: z.string().min(1, { message: "Ингредиент не может быть пустым" }),
});

const recipeSchema = z.object({
  title: z.string().min(3, { message: "Название должно содержать не менее 3 символов" }),
  ingredients: z.array(ingredientSchema),
  instructions: z.string().min(20, { message: "Инструкции должны содержать не менее 20 символов" }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Выберите уровень сложности",
  }),
  categoryId: z.string({
    required_error: "Выберите категорию",
  }),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      ingredients: [{ name: "" }],
      instructions: "",
      difficulty: "medium",
      categoryId: "",
    },
  });
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error("Не удалось загрузить категории. Пожалуйста, попробуйте позже.");
      }
    };
    
    loadCategories();
  }, []);
  
  const onSubmit = async (values: RecipeFormValues) => {
    try {
      setIsSubmitting(true);
      
      const ingredients = values.ingredients.map(ingredient => ingredient.name);
      
      const recipeData = {
        title: values.title,
        ingredients,
        instructions: values.instructions,
        difficulty: values.difficulty,
        categoryId: values.categoryId,
      };
      
      const createdRecipe = await createRecipe(recipeData);
      
      if (imageFile && createdRecipe.id) {
        await uploadRecipeImage(createdRecipe.id, imageFile);
      }
      
      toast.success("Рецепт успешно создан!");
      navigate(`/recipes/${createdRecipe.id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error("Не удалось создать рецепт. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const { fields: ingredientFields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-recipe-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-recipe-900">Создать новый рецепт</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о рецепте</CardTitle>
                  <CardDescription>
                    Заполните все необходимые поля для создания рецепта
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Название рецепта</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Например: Борщ по-украински" 
                                {...field} 
                                className="recipe-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Ингредиенты</FormLabel>
                        <div className="space-y-3 mt-2">
                          {ingredientFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`ingredients.${index}.name`}
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormControl>
                                      <Input
                                        placeholder="Например: 2 столовые ложки масла"
                                        {...field}
                                        className="recipe-input"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {ingredientFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ name: "" })}
                            className="mt-2"
                          >
                            <Plus size={16} className="mr-2" />
                            Добавить ингредиент
                          </Button>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Инструкции по приготовлению</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Опишите процесс приготовления шаг за шагом..." 
                                {...field} 
                                className="recipe-input min-h-[200px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Уровень сложности</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="recipe-input">
                                    <SelectValue placeholder="Выберите уровень сложности" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="easy">Легкий</SelectItem>
                                  <SelectItem value="medium">Средний</SelectItem>
                                  <SelectItem value="hard">Сложный</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Категория</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="recipe-input">
                                    <SelectValue placeholder="Выберите категорию" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <CardFooter className="px-0 pt-6 flex justify-end">
                        <Button
                          type="submit"
                          className="bg-recipe-600 hover:bg-recipe-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Создание..." : "Создать рецепт"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Фотография блюда</CardTitle>
                  <CardDescription>
                    Загрузите фотографию вашего кулинарного шедевра
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-auto"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={removeImage}
                        className="w-full"
                      >
                        <Trash2 size={16} className="mr-2 text-red-500" />
                        Удалить изображение
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-recipe-600 text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-recipe-700 transition-colors"
                        >
                          Выбрать файл
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF до 10MB
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
