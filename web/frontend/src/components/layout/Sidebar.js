import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import ConfirmDialog from "../common/ConfirmDialog";

const Sidebar = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { name: t("dashboard"), icon: LayoutDashboard, path: "/" },
    { name: t("appointments"), icon: Calendar, path: "/appointments" },
    { name: t("patients"), icon: Users, path: "/patients" },
    { name: t("analytics"), icon: BarChart3, path: "/analytics" },
    { name: t("settings"), icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`bg-bg-sidebar border-r border-border-light flex flex-col py-6 shrink-0 h-full transition-all duration-300 relative ${isCollapsed ? "w-[80px] px-4" : "w-[260px] px-4 z-20"}`}>
      <div className="flex items-center gap-3 mb-10 w-full overflow-hidden">
        <div className="w-9 h-9 bg-primary text-white rounded-md flex items-center justify-center shrink-0">
          <Activity size={20} />
        </div>
        <div
          className={`text-xl font-bold tracking-tight text-text-dark whitespace-nowrap overflow-hidden transition-all duration-300 ease-out ${isCollapsed ? "max-w-0 opacity-0 -translate-x-2" : "max-w-[140px] opacity-100 translate-x-0"}`}>
          Doct<span className="text-primary">ome</span>
        </div>
      </div>

      <nav className="flex flex-col gap-2 grow w-full">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md font-medium transition-all px-4 py-3 ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:bg-border-subtle hover:text-text-dark"
              }`
            }
            title={isCollapsed ? item.name : undefined}>
            <item.icon size={isCollapsed ? 22 : 20} className="shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-out ${isCollapsed ? "max-w-0 opacity-0 translate-x-[-6px]" : "max-w-[140px] opacity-100 translate-x-0"}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="flex items-center gap-3 mt-auto rounded-md border border-border-light cursor-pointer text-text-muted hover:bg-danger-bg hover:text-danger hover:border-danger/30 transition-all px-4 py-3 w-full"
        title={isCollapsed ? t("logout") : undefined}>
        <LogOut size={isCollapsed ? 22 : 18} className="shrink-0" />
        <span
          className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-out ${isCollapsed ? "max-w-0 opacity-0 translate-x-[-6px]" : "max-w-[140px] opacity-100 translate-x-0"}`}>
          {t("logout")}
        </span>
      </button>
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out of Doctome?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
