import { useRef } from "react";
import { Outlet } from "react-router";
import MobileTopBar from "./ui/MobileTopBar";
import DesktopHeader from "./ui/DesktopHeader";
import Sidebar from "./ui/Sidebar";

const DashboardLayout = () => {
  const drawerRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="drawer lg:drawer-open bg-base-200 text-base-content min-h-screen">
      <input
        ref={drawerRef}
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col w-full">
        <MobileTopBar />
        <DesktopHeader />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Sidebar drawerRef={drawerRef} />
    </div>
  );
};

export default DashboardLayout;