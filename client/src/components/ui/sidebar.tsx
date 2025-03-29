import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";

export function Sidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useApp();

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-primary-800 text-white">
      <div className="p-4 flex items-center">
        <svg
          className="h-10 w-10 text-white"
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
        <h1 className="text-xl font-semibold ml-2">{t("app.title")}</h1>
      </div>
      
      <div className="p-4 flex items-center border-b border-primary-700">
        <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-lg font-semibold mr-2">
          {user?.fullName?.charAt(0) || "U"}
        </div>
        <div>
          <div className="font-medium">{user?.fullName || t("user.guest")}</div>
          <div className="text-xs text-gray-300">
            {user?.nik ? `NIK: ${user.nik}` : t("user.not_logged_in")}
          </div>
        </div>
      </div>
      
      <nav className="flex-1">
        <ul className="py-4">
          <li>
            <Link href="/">
              <a className={`block px-4 py-2 hover:bg-primary-700 flex items-center ${isActiveRoute("/") ? "bg-primary-700" : ""}`}>
                <span className="material-icons mr-3">dashboard</span>
                <span>{t("nav.dashboard")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <a className={`block px-4 py-2 hover:bg-primary-700 flex items-center ${isActiveRoute("/services") || location.startsWith("/services/") ? "bg-primary-700" : ""}`}>
                <span className="material-icons mr-3">apps</span>
                <span>{t("nav.services")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/applications">
              <a className={`block px-4 py-2 hover:bg-primary-700 flex items-center ${isActiveRoute("/applications") ? "bg-primary-700" : ""}`}>
                <span className="material-icons mr-3">history</span>
                <span>{t("nav.applications")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a className={`block px-4 py-2 hover:bg-primary-700 flex items-center ${isActiveRoute("/profile") ? "bg-primary-700" : ""}`}>
                <span className="material-icons mr-3">person</span>
                <span>{t("nav.profile")}</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <a className={`block px-4 py-2 hover:bg-primary-700 flex items-center ${isActiveRoute("/help") ? "bg-primary-700" : ""}`}>
                <span className="material-icons mr-3">help</span>
                <span>{t("nav.help")}</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-700">
        <button 
          onClick={() => logout()}
          className="block py-2 text-red-300 flex items-center hover:text-red-200"
        >
          <span className="material-icons mr-3">logout</span>
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </div>
  );
}
