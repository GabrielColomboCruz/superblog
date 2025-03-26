// components/NotificationBell.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  conteudo: string;
  usuario: string;
  post_id: string;
  criado_em: string;
  read: string;
}

interface NotificationBellProps {
  userId?: string;
  postId?: string;
}

export function NotificationBell({ userId, postId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // We calculate unread count based on the read status from the database
  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      let url = "/api/notificacao?";
      if (userId) url += `Usuario=${encodeURIComponent(userId)}`;
      if (postId) url += `Post=${encodeURIComponent(postId)}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.status === 200) {
        const sortedNotifications = data.result.sort(
          (a: Notification, b: Notification) =>
            new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
        );
        console.log("Sorted Data : ", sortedNotifications);
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle marking a single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notificacao`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: notificationId, Read: 1 }),
      });

      // Update local state to reflect the change
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: "0" }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle clicking a notification
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to the post
    router.push(`/specificPost/${notification.post_id}`);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, postId, fetchNotifications]);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-container relative">
      {/* Bell icon with notification count */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="relative p-2 rounded-full hover:bg-super-100 transition-colors"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-super-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown - now with responsive design */}
      {isOpen && (
        <div
          className={`
          fixed md:absolute 
          md:right-0 
          md:w-96 
          md:mt-2 
          bg-super-50 
          shadow-lg 
          border 
          border-super-200 
          z-50
          top-0 
          left-0 
          w-full 
          h-full 
          md:h-auto 
          md:max-h-[80vh]
        `}
        >
          {/* Header */}
          <div className="sticky top-0 bg-super-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 text-super-500 hover:text-super-700"
            >
              Close
            </button>
          </div>

          {/* Notifications list */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 120px)", height: "100%" }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 border-b border-gray-100 
                    hover:bg-super-50 transition-colors 
                    cursor-pointer
                    ${notification.read ? "bg-super-50" : "bg-super-50"}
                  `}
                >
                  <p className="text-sm text-super-800">
                    {notification.conteudo}
                  </p>
                  <p className="text-xs text-super-500 mt-1">
                    {new Date(notification.criado_em).toLocaleDateString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-super-500">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
