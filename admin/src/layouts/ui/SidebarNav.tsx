import { Link, useLocation } from "react-router";
import type{ RefObject } from "react";
import { House, ShoppingBag, CalendarArrowUp, Users } from "lucide-react";

const sidebarItems = [
  { id: 1, Icon: House, title: "Dashboard", href: "/dashboard" },
  { id: 2, Icon: ShoppingBag, title: "Products", href: "/products" },
  { id: 3, Icon: CalendarArrowUp, title: "Orders", href: "/orders" },
  { id: 4, Icon: Users, title: "Customers", href: "/customers" },
];

interface SidebarNavProps {
  drawerRef: RefObject<HTMLInputElement | null>;
}

const SidebarNav = ({ drawerRef }: SidebarNavProps) => {
    const location = useLocation()
  return (
    <ul className="menu gap-4 w-full p-0 mt-10">
      {sidebarItems.map(({ id, title, Icon, href }) => (
        <li key={id}>
          <Link
            to={href}
            onClick={() => drawerRef.current?.click()}
            className={ `btn btn-soft hover:btn-accent justify-start ${
                location.pathname === href ? "btn-accent btn-active" : ""
              }`}
          >
            <Icon size={18} />
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNav;
