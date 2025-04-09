
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register as apiRegister, setAuth } from "@/api/auth";
import { toast } from "sonner";

// Validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов" })
    .max(50, { message: "Имя должно содержать не более 50 символов" }),
  username: z
    .string()
    .min(3, { message: "Логин должен содержать не менее 3 символов" })
    .max(20, { message: "Логин должен содержать не более 20 символов" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Логин может содержать только латинские буквы, цифры и подчеркивания",
    }),
  email: z
    .string()
    .email({ message: "Введите корректный email адрес" }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву" })
    .regex(/[a-z]/, { message: "Пароль должен содержать хотя бы одну строчную букву" })
    .regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRegister(
        values.name,
        values.username,
        values.password,
        values.email
      );
      
      setAuth(response);
      toast.success("Регистрация прошла успешно!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Ошибка при регистрации. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-recipe-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <ChefHat size={50} className="text-recipe-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Регистрация
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Создайте аккаунт, чтобы начать делиться вашими рецептами
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} className="recipe-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логин</FormLabel>
                    <FormControl>
                      <Input placeholder="ivan_petrov" {...field} className="recipe-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ivan@example.com"
                        {...field}
                        className="recipe-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="recipe-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-recipe-600 hover:bg-recipe-700"
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p>
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className="font-medium text-recipe-600 hover:text-recipe-500 transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
