import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-main">
      <Sidebar />
      <main className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <div className="flex-grow overflow-y-auto p-8 bg-bg-main custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
