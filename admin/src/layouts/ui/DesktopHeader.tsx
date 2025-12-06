import { LayoutDashboard, LogOut } from "lucide-react";
import { useLocation } from "react-router";
import { SignOutButton } from "@clerk/clerk-react";

const DesktopHeader = () => {
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1];

  return (
    <header className="hidden lg:flex items-center justify-between bg-base-100 border-b border-base-300 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-accent p-2 rounded-xl text-accent-content shadow-md">
          <LayoutDashboard size={22} />
        </div>
        <h2 className="text-2xl font-bold capitalize">{currentPage}</h2>
      </div>
      <SignOutButton>
        <button className="btn btn-accent btn-soft btn-sm gap-2">
          <LogOut size={16} /> Sign Out
        </button>
      </SignOutButton>
    </header>
  );
};

export default DesktopHeader;