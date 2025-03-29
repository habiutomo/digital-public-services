import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: number;
  username: string;
  nik: string;
  fullName: string;
  language: string;
  // Other user fields
};

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type AppContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  notifications: Notification[];
  unreadNotificationsCount: number;
  notificationsPanelOpen: boolean;
  toggleNotificationsPanel: () => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  languageDropdownOpen: boolean;
  toggleLanguageDropdown: () => void;
  changeLanguage: (language: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  
  // User authentication query
  const { 
    data: user, 
    isLoading: isUserLoading,
    refetch: refetchUser
  } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Change user language
  const changeLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const response = await apiRequest("PUT", `/api/users/${user.id}/language`, { language });
      return response.json();
    },
    onSuccess: (data) => {
      i18n.changeLanguage(data.language);
      toast({
        title: t("language.changed"),
        description: t("language.changed_description"),
      });
      refetchUser();
    }
  });
  
  // Notifications query
  const { 
    data: notifications = [], 
    refetch: refetchNotifications
  } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });
  
  // Unread notifications count
  const { 
    data: unreadNotificationsData, 
    refetch: refetchUnreadCount 
  } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    enabled: !!user,
  });
  
  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      refetchNotifications();
      refetchUnreadCount();
    }
  });
  
  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      refetchNotifications();
      refetchUnreadCount();
    }
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string, password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      refetchUser();
    }
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      refetchUser();
    }
  });
  
  // Set app language when user changes
  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user.language);
    }
  }, [user, i18n]);
  
  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(prev => !prev);
  };
  
  const markNotificationAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };
  
  const markAllNotificationsAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(prev => !prev);
  };
  
  const changeLanguage = (language: string) => {
    changeLanguageMutation.mutate(language);
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        isLoading: isUserLoading,
        isAuthenticated: !!user,
        login,
        logout,
        notifications,
        unreadNotificationsCount: unreadNotificationsData?.count || 0,
        notificationsPanelOpen,
        toggleNotificationsPanel,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        languageDropdownOpen,
        toggleLanguageDropdown,
        changeLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Custom query function that returns null on 401
function getQueryFn({ on401 }: { on401: "returnNull" | "throw" }) {
  return async ({ queryKey }: { queryKey: unknown[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
    
    return res.json();
  };
}
