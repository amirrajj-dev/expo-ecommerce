import { ShoppingBag } from "lucide-react";
import type { RefObject } from "react";
import SidebarNav from "./SidebarNav";
import SidebarUserInfo from "./SidebarUserInfo";

interface SidebarProps {
  drawerRef: RefObject<HTMLInputElement | null>;
}

const Sidebar = ({ drawerRef }: SidebarProps) => {
  return (
    <div className="drawer-side z-50">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="w-72 sm:w-84 bg-base-100 border-r border-base-300 p-5 flex flex-col justify-between min-h-full">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent p-2 rounded-xl text-accent-content shadow-md">
              <ShoppingBag size={20} />
            </div>
            <h1 className="text-xl font-extrabold tracking-wide">
              Admin Panel
            </h1>
          </div>
          <SidebarNav drawerRef={drawerRef} />
        </div>
        <SidebarUserInfo />
      </aside>
    </div>
  );
};

export default Sidebar;