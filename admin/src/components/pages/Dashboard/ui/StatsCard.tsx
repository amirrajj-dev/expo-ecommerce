import { DollarSign, Users, ShoppingBag, Package } from "lucide-react";
import type { StatCardData } from "../types";

interface StatsCardProps {
  card: StatCardData;
}

const iconMap = {
  dollar: DollarSign,
  users: Users,
  shoppingBag: ShoppingBag,
  package: Package,
};

export const StatsCard = ({ card }: StatsCardProps) => {
  const Icon = iconMap[card.iconType];

  return (
    <div className="card bg-base-100 relative shadow-sm hover:shadow-xl transition-all duration-300 border border-base-300/50 hover:border-base-300 p-6 lg:p-8 flex items-center justify-between rounded-2xl overflow-hidden group hover:-translate-y-1">
      <div className="flex flex-col gap-1.5 items-center z-10 relative">
        <p className="text-sm font-medium text-base-content/70">
          {card.title}
        </p>
        <p className="text-3xl lg:text-4xl font-bold tracking-tight bg-linear-to-r from-base-content to-base-content/80 bg-clip-text text-transparent">
          {card.value}
        </p>
      </div>

      <div className="absolute -right-4 -top-4 opacity-20 group-hover:opacity-80 transition-all duration-500 group-hover:scale-110">
        <div className={`p-10 rounded-full ${card.color} backdrop-blur-sm`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};