import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";
import { Input } from "@/components/ui/input";

interface DesktopHeaderProps {
  onSearch: (query: string) => void;
}

export function DesktopHeader({ onSearch }: DesktopHeaderProps) {
  const { t } = useTranslation();
  const { 
    unreadNotificationsCount, 
    toggleNotificationsPanel,
    toggleLanguageDropdown
  } = useApp();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className="hidden md:flex bg-white shadow-sm py-2 px-6 items-center justify-between">
      <div className="flex items-center">
        <div className="relative mr-2">
          <span className="material-icons text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">search</span>
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="flex items-center">
        <button 
          className="mr-4 relative" 
          onClick={toggleNotificationsPanel}
          aria-label={t("notifications.title")}
        >
          <span className="material-icons text-gray-600">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute notification-badge bg-amber-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
        <button 
          onClick={toggleLanguageDropdown} 
          className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm mr-4"
          aria-label={t("language.toggle")}
        >
          <span>{t("language.current_short")}</span>
          <span className="material-icons text-sm ml-1">arrow_drop_down</span>
        </button>
      </div>
    </header>
  );
}
