import { Menu, LayoutDashboard } from "lucide-react";
import { useLocation } from "react-router";

const MobileTopBar = () => {
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1];

  return (
    <div className="w-full flex items-center justify-between bg-base-100 border-b border-base-300 p-4 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="bg-accent p-2 rounded-xl text-accent-content shadow-md">
          <LayoutDashboard size={20} />
        </div>
        <h2 className="text-lg font-bold capitalize">{currentPage}</h2>
      </div>
      <label
        htmlFor="drawer-toggle"
        className="btn btn-accent btn-soft btn-sm sm:btn-md"
      >
        <Menu />
      </label>
    </div>
  );
};

export default MobileTopBar;