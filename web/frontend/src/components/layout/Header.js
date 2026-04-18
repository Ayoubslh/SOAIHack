import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Bell, X, Check, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dropdown, { DropdownItem } from "../common/Dropdown";

const api = "http://localhost:3000";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

 

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${api}/notifications?user_id=${userId}`);
        if (res.data?.success) {
          setNotifications(res.data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();

    const sse = new EventSource(`${api}/sse/notifications?user_id=${userId}`);
    
    sse.addEventListener("notification", (event) => {
      if (event.data) {
        try {
          const newNotif = JSON.parse(event.data);
          setNotifications((prev) => {
            // Prevent duplicates if backend emits the same ID
            if (newNotif._id && prev.some(n => n._id === newNotif._id)) return prev;
            return [newNotif, ...prev];
          });
        } catch (e) {
          console.error("Failed to parse notification JSON:", e);
        }
      }
    });

    return () => {
      sse.close();
    };
  }, [user]);

  const getTimeString = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.max(0, Date.now() - new Date(timestamp).getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return t("time_ago_m").replace("{t}", Math.max(1, minutes));
    if (hours < 24) return t("time_ago_h").replace("{t}", hours);
    return t("time_ago_d").replace("{t}", days);
  };

  const unreadCount = notifications.length;

  const markSelectedAsRead = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
  };

  const markAllAsRead = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    try {
      await axios.delete(`${api}/notifications?user_id=${userId}`);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const dismissNotification = (id) => {
    markSelectedAsRead(id);
  };

  return (
    <header className="h-[72px] border-b border-border-light flex items-center justify-between px-8 bg-bg-main shrink-0">
      {/* Empty div for flexbox spacing (left) */}
      <div className="w-10"></div>

     

      <div className="flex items-center gap-4 shrink-0 relative z-50">
        <Dropdown
          align="right"
          className="w-32"
          trigger={
            <button
              className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0"
              title="Change Language">
              <Globe size={20} />
            </button>
          }>
          <DropdownItem
            onClick={() => setLanguage("en")}
            className={language === "en" ? "font-bold" : ""}>
            English
          </DropdownItem>
          <DropdownItem
            onClick={() => setLanguage("fr")}
            className={language === "fr" ? "font-bold" : ""}>
            Français
          </DropdownItem>
          <DropdownItem
            onClick={() => setLanguage("ar")}
            className={language === "ar" ? "font-bold" : ""}>
            العربية
          </DropdownItem>
        </Dropdown>

        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0"
          title="Toggle theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Dropdown
          align="right"
          className="w-80"
          trigger={
            <div className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-bg-main"></span>
              )}
            </div>
          }>
          <div
            keepOpen
            className="w-80 max-h-[80vh] flex flex-col overflow-hidden bg-bg-card shadow-lg border border-border-light rounded-lg">
            <div className="p-4 border-b border-border-light flex justify-between items-center bg-border-subtle">
              <h3 className="font-semibold text-text-dark">
                {t("notifications")}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  <Check size={12} /> {t("mark_all_read")}
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-muted">
                  {t("no_notifications")}
                </div>
              ) : (
                notifications.map((notif) => {
                  const id = notif._id || notif.id || Math.random();
                  const isUnread = notif.unread !== false;

                  return (
                    <div
                      key={id}
                      className={`p-4 border-b border-border-subtle last:border-0 hover:bg-border-subtle transition-colors cursor-pointer flex gap-4 ${isUnread ? 'bg-primary-light/10' : ''}`}
                      onClick={() => markSelectedAsRead(id)}>
                      <div className="flex-grow">
                        <p
                          className={`text-sm ${isUnread ? 'font-medium text-text-dark' : 'text-text-muted'}`}>
                          {notif.message || notif.text}
                        </p>
                        
                        {notif.type === "confirmation_request" && notif.confirm_url && notif.decline_url && (
                          <div className="flex gap-2 mt-2">
                            <button 
                              className="text-xs px-3 py-1 bg-success/10 text-success font-medium rounded-full hover:bg-success hover:text-white transition-colors"
                              onClick={(e) => { e.stopPropagation(); window.open(notif.confirm_url, "_blank"); }}>
                              Confirm
                            </button>
                            <button 
                              className="text-xs px-3 py-1 bg-danger/10 text-danger font-medium rounded-full hover:bg-danger hover:text-white transition-colors"
                              onClick={(e) => { e.stopPropagation(); window.open(notif.decline_url, "_blank"); }}>
                              Decline
                            </button>
                          </div>
                        )}

                        <span className="text-xs text-text-muted mt-1 block">
                          {getTimeString(notif.timestamp)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(id);
                        }}
                        className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity p-1 self-start"
                        title={t("dismiss")}>
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
