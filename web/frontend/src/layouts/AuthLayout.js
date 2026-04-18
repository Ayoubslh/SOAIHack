import React from "react";
import { Outlet } from "react-router-dom";
import { Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-screen bg-bg-sidebar overflow-hidden items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl flex shadow-2xl overflow-hidden bg-bg-main border border-border-light relative z-10 transition-all duration-300">
        {/* Left Side - Visual / Brand */}
        <div className="hidden lg:flex w-1/2 bg-primary-light flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary rounded-full opacity-10 blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#10b981] rounded-full opacity-10 blur-3xl mix-blend-multiply"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                <Activity size={28} />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-text-dark">
                Doct<span className="text-primary">ome</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-text-dark mt-16 leading-tight">
              Manage your clinic
              <br />
              with <span className="text-primary">precision</span>.
            </h1>
            <p className="text-text-muted mt-6 text-lg max-w-md">
              Doctome helps you reduce no-shows, optimize schedules, and improve
              patient outcomes through predictive analytics.
            </p>
          </div>

          <div className="relative z-10 text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Doctome Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
          <div className="w-full max-w-md relative z-10">
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="w-10 h-10 bg-primary text-white rounded-md flex items-center justify-center shadow-sm">
                <Activity size={24} />
              </div>
              <div className="text-2xl font-bold tracking-tight text-text-dark">
                Doct<span className="text-primary">ome</span>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
