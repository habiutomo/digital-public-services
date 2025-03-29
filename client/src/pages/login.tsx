import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form schema
  const loginFormSchema = z.object({
    username: z.string().min(3, {
      message: t("login.validation.username_required"),
    }),
    password: z.string().min(6, {
      message: t("login.validation.password_required"),
    }),
  });
  
  // Register form schema
  const registerFormSchema = z.object({
    username: z.string().min(3, {
      message: t("register.validation.username_required"),
    }),
    nik: z.string().min(16, {
      message: t("register.validation.nik_required"),
    }).max(16, {
      message: t("register.validation.nik_length"),
    }),
    fullName: z.string().min(2, {
      message: t("register.validation.name_required"),
    }),
    password: z.string().min(6, {
      message: t("register.validation.password_required"),
    }),
    confirmPassword: z.string().min(6, {
      message: t("register.validation.confirm_password_required"),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("register.validation.passwords_must_match"),
    path: ["confirmPassword"],
  });
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      nik: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Handle login form submission
  const onLoginSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoggingIn(true);
    try {
      await login(data.username, data.password);
      setLocation("/");
    } catch (error: any) {
      toast({
        title: t("login.error"),
        description: error.message || t("login.error_description"),
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Handle register form submission
  const onRegisterSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    // In a real app, you would send the registration data to the API
    // For this demo, just show a toast and switch to login tab
    toast({
      title: t("register.success"),
      description: t("register.success_description"),
    });
    
    // Reset form and switch to login tab
    registerForm.reset();
    setActiveTab("login");
  };
  
  // Change language handler
  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="absolute top-4 right-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleChangeLanguage("id")}
            className={`px-2 py-1 text-sm rounded ${i18n.language === "id" ? "bg-primary-100 text-primary-800" : "bg-white"}`}
          >
            ID
          </button>
          <button
            onClick={() => handleChangeLanguage("en")}
            className={`px-2 py-1 text-sm rounded ${i18n.language === "en" ? "bg-primary-100 text-primary-800" : "bg-white"}`}
          >
            EN
          </button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <svg
            className="h-12 w-12 text-primary-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t("app.title")}</h1>
        <p className="text-gray-600 mt-1">{t("app.description")}</p>
      </div>
      
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("login.title")}</TabsTrigger>
            <TabsTrigger value="register">{t("register.title")}</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t("login.title")}</CardTitle>
                <CardDescription>{t("login.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("login.username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("login.username_placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("login.password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("login.password_placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? t("login.logging_in") : t("login.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                  {t("login.demo_credentials")}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t("register.title")}</CardTitle>
                <CardDescription>{t("register.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("register.username_placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="nik"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.nik")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("register.nik_placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.full_name")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("register.full_name_placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.password")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder={t("register.password_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.confirm_password")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder={t("register.confirm_password_placeholder")} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      {t("register.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </div>
  );
}
