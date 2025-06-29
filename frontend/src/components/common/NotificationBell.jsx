import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { getUserNotifications, markNotificationAsRead } from "../../utils/apiService";

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Erreur de récupération des notifications:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications(); // refresh
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const unreadCount = notifications.filter((n) => n.isVu === 0).length;

  return (
    <div className="notification-container">
      <button
        className="notification-button"
        onClick={() => setOpen(!open)}
        aria-label="notifications"
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
  <div className="notification-dropdown">
    {notifications.length === 0 && (
      <div className="notification-item">Aucune notification.</div>
    )}
    {notifications.map((notif) => (
      <div
        key={notif.id}
        className={`notification-item ${notif.isVu ? "read" : "unread"}`}
        onClick={() => handleMarkAsRead(notif.id)}
      >
        {notif.message}
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default NotificationBell;
