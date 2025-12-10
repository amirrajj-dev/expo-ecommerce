import { ShoppingBag, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import type { Order } from "../../../../types/interfaces/order.interface";

interface StatsCardsProps {
  orders: Order[];
}

const StatsCards = ({ orders }: StatsCardsProps) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingBag className="h-6 w-6 text-primary" />}
        color="primary"
      />
      <StatCard
        title="Pending"
        value={pendingOrders}
        icon={<Clock className="h-6 w-6 text-success" />}
        color="success"
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={<DollarSign className="h-6 w-6 text-accent" />}
        color="accent"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "success" | "accent";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 border-primary/20 bg-primary/20",
    success: "from-success/10 to-success/5 border-success/20 bg-success/20",
    accent: "from-accent/10 to-accent/5 border-accent/20 bg-accent/20",
  };

  return (
    <div
      className={`bg-linear-to-br ${colorClasses[color]} border rounded-xl p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/70">{title}</p>
          <p className="text-2xl font-bold text-base-content mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[3]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;