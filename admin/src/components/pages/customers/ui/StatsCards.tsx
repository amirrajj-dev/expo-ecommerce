import { Users, Calendar, Heart, MapPin } from "lucide-react";
import StatCard from "./StatCard";
import type { User } from "../../../../types/interfaces/user.interface";
import { countNewToday } from "../utils/formatters";

interface StatsCardsProps {
  customers: User[];
}

const StatsCards = ({ customers }: StatsCardsProps) => {
  const stats = {
    total: customers.length,
    newToday: countNewToday(customers),
    withWishlist: customers.filter((c) => c.wishlist.length > 0).length,
    withAddresses: customers.filter((c) => c.addresses.length > 0).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Customers"
        value={stats.total}
        icon={<Users className="h-6 w-6 text-primary" />}
        color="primary"
      />
      <StatCard
        title="New Today"
        value={stats.newToday}
        icon={<Calendar className="h-6 w-6 text-success" />}
        color="success"
      />
      <StatCard
        title="With Wishlist"
        value={stats.withWishlist}
        icon={<Heart className="h-6 w-6 text-info" />}
        color="info"
      />
      <StatCard
        title="With Addresses"
        value={stats.withAddresses}
        icon={<MapPin className="h-6 w-6 text-accent" />}
        color="accent"
      />
    </div>
  );
};

export default StatsCards;