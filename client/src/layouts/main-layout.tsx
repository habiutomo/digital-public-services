import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { DesktopHeader } from "@/components/ui/desktop-header";
import { Footer } from "@/components/ui/footer";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useApp } from "@/contexts/app-context";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation();
  const { 
    notificationsPanelOpen, 
    toggleNotificationsPanel,
    languageDropdownOpen
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Header for mobile */}
      <header className="bg-primary-800 text-white p-4 flex justify-between items-center md:hidden">
        <div className="flex items-center">
          <svg
            className="h-8 w-auto text-white"
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
          <h1 className="text-lg font-semibold ml-2">{t("app.title")}</h1>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
          aria-label={t("nav.toggle_menu")}
        >
          <span className="material-icons">{mobileMenuOpen ? "close" : "menu"}</span>
        </button>
      </header>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop header */}
        <DesktopHeader onSearch={handleSearch} />

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
      
      {/* Notification panel */}
      <NotificationPanel 
        open={notificationsPanelOpen} 
        onClose={toggleNotificationsPanel}
      />
      
      {/* Language dropdown */}
      <LanguageDropdown open={languageDropdownOpen} />
    </div>
  );
}
