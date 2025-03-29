import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { id as dateFnsId, enUS as dateFnsEn } from "date-fns/locale";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { t, i18n } = useTranslation();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  // Format relative time with the correct locale
  const formatRelativeTime = (date: string) => {
    const locale = i18n.language === 'id' ? dateFnsId : dateFnsEn;
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale
    });
  };

  // Get the appropriate icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="material-icons text-amber-600 text-sm">notifications</span>
          </div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="material-icons text-green-600 text-sm">check_circle</span>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="material-icons text-red-600 text-sm">error</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="material-icons text-gray-600 text-sm">notifications</span>
          </div>
        );
    }
  };

  const handleNotificationClick = (id: number) => {
    markNotificationAsRead(id);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{t("notifications.title")}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label={t("common.close")}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="py-2">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.isRead ? 'opacity-70' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <span className="material-icons text-gray-300 text-5xl mb-2">notifications_off</span>
              <p>{t("notifications.empty")}</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full px-4 py-2 text-center text-sm text-primary-600 hover:bg-primary-50 rounded"
              onClick={markAllNotificationsAsRead}
            >
              {t("notifications.mark_all_read")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
