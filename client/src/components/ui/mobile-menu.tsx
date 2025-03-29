import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { 
    user, 
    logout, 
    unreadNotificationsCount, 
    toggleNotificationsPanel,
    toggleLanguageDropdown 
  } = useApp();

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  const handleNotificationsClick = () => {
    toggleNotificationsPanel();
    onClose();
  };

  return (
    <div className="md:hidden bg-primary-700 text-white w-full">
      <nav className="py-2">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-lg font-semibold mr-2">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <span>{user?.fullName || t("user.guest")}</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleNotificationsClick}
              className="mr-3 relative"
              aria-label={t("notifications.title")}
            >
              <span className="material-icons">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute notification-badge bg-amber-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleLanguageDropdown}
              className="flex items-center text-sm"
              aria-label={t("language.toggle")}
            >
              <span>{t("language.current_short")}</span>
              <span className="material-icons text-sm ml-1">arrow_drop_down</span>
            </button>
          </div>
        </div>
        <ul className="mt-2">
          <li>
            <Link href="/">
              <a 
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-primary-600 flex items-center"
              >
                <span className="material-icons mr-3">dashboard</span>
                <span>{t("nav.dashboard")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <a 
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-primary-600 flex items-center"
              >
                <span className="material-icons mr-3">apps</span>
                <span>{t("nav.services")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/applications">
              <a 
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-primary-600 flex items-center"
              >
                <span className="material-icons mr-3">history</span>
                <span>{t("nav.applications")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a 
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-primary-600 flex items-center"
              >
                <span className="material-icons mr-3">person</span>
                <span>{t("nav.profile")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <a 
                onClick={handleLinkClick}
                className="block px-4 py-2 hover:bg-primary-600 flex items-center"
              >
                <span className="material-icons mr-3">help</span>
                <span>{t("nav.help")}</span>
              </a>
            </Link>
          </li>
          <li className="border-t border-primary-600 mt-2 pt-2">
            <button 
              onClick={() => {
                logout();
                onClose();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-primary-600 flex items-center text-red-300"
            >
              <span className="material-icons mr-3">logout</span>
              <span>{t("nav.logout")}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
