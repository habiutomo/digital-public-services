import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  // Profile update schema
  const profileFormSchema = z.object({
    fullName: z.string().min(2, {
      message: t("profile.validation.name_required"),
    }),
    birthPlace: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    religion: z.string().optional(),
    maritalStatus: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({
      message: t("profile.validation.email_invalid"),
    }).optional().or(z.literal('')),
  });

  // Security update schema
  const securityFormSchema = z.object({
    currentPassword: z.string().min(6, {
      message: t("profile.validation.current_password_required"),
    }),
    newPassword: z.string().min(6, {
      message: t("profile.validation.new_password_length"),
    }),
    confirmPassword: z.string().min(6, {
      message: t("profile.validation.confirm_password_required"),
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("profile.validation.passwords_must_match"),
    path: ["confirmPassword"],
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      birthPlace: user?.birthPlace || "",
      birthDate: user?.birthDate || "",
      gender: user?.gender || "",
      religion: user?.religion || "",
      maritalStatus: user?.maritalStatus || "",
      address: user?.address || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  // Security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      if (!user) throw new Error("User not authenticated");
      const response = await apiRequest("PUT", `/api/users/${user.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("profile.update_success"),
        description: t("profile.profile_updated"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error) => {
      toast({
        title: t("profile.update_error"),
        description: error.message || t("profile.update_error_description"),
        variant: "destructive",
      });
    },
  });

  // Password update mutation - this is a mock since we don't have a real endpoint for this
  const passwordUpdateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof securityFormSchema>) => {
      if (!user) throw new Error("User not authenticated");
      // In a real application, you would send this to a password update endpoint
      // For demo purposes, we're just simulating a successful update
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: t("profile.password_update_success"),
        description: t("profile.password_updated"),
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast({
        title: t("profile.password_update_error"),
        description: error.message || t("profile.password_update_error_description"),
        variant: "destructive",
      });
    },
  });

  // Form submit handlers
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    profileUpdateMutation.mutate(data);
  };

  const onSecuritySubmit = (data: z.infer<typeof securityFormSchema>) => {
    passwordUpdateMutation.mutate(data);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t("profile.title")}</h2>
        <p className="text-gray-600 mt-1">{t("profile.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-semibold text-primary-600 mb-4">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <h3 className="text-xl font-medium">{user?.fullName}</h3>
                <p className="text-gray-500 mb-2">NIK: {user?.nik}</p>
                
                <div className="w-full mt-4 space-y-3">
                  <div className="flex items-center">
                    <span className="material-icons text-gray-400 mr-2">account_circle</span>
                    <span className="text-gray-600">{user?.username}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 mr-2">email</span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 mr-2">phone</span>
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 mr-2">home</span>
                      <span className="text-gray-600">{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Edit Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="personal">{t("profile.personal_information")}</TabsTrigger>
              <TabsTrigger value="security">{t("profile.security")}</TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.edit_profile")}</CardTitle>
                  <CardDescription>{t("profile.edit_profile_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.full_name")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="birthPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.birth_place")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.birth_date")}</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.gender")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("form.gender_placeholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="L">{t("form.gender_male")}</SelectItem>
                                  <SelectItem value="P">{t("form.gender_female")}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="religion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.religion")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("form.religion_placeholder")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="islam">{t("form.religion_islam")}</SelectItem>
                                  <SelectItem value="kristen">{t("form.religion_christian")}</SelectItem>
                                  <SelectItem value="katolik">{t("form.religion_catholic")}</SelectItem>
                                  <SelectItem value="hindu">{t("form.religion_hindu")}</SelectItem>
                                  <SelectItem value="buddha">{t("form.religion_buddhist")}</SelectItem>
                                  <SelectItem value="konghucu">{t("form.religion_confucian")}</SelectItem>
                                  <SelectItem value="lainnya">{t("form.religion_other")}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.marital_status")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("form.marital_status_placeholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="belum-kawin">{t("form.marital_status_single")}</SelectItem>
                                <SelectItem value="kawin">{t("form.marital_status_married")}</SelectItem>
                                <SelectItem value="cerai-hidup">{t("form.marital_status_divorced")}</SelectItem>
                                <SelectItem value="cerai-mati">{t("form.marital_status_widowed")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.address")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.phone")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.email")}</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto" 
                        disabled={profileUpdateMutation.isPending}
                      >
                        {profileUpdateMutation.isPending ? t("profile.saving") : t("profile.save_changes")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.change_password")}</CardTitle>
                  <CardDescription>{t("profile.change_password_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("profile.current_password")}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("profile.new_password")}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              {t("profile.password_requirements")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("profile.confirm_password")}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto"
                        disabled={passwordUpdateMutation.isPending}
                      >
                        {passwordUpdateMutation.isPending 
                          ? t("profile.updating_password") 
                          : t("profile.update_password")
                        }
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
