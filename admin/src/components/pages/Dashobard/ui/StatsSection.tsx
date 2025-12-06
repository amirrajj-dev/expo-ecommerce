import { StatsCard } from "./StatsCard";
import type { StatCardData } from '../types'
import StatsSectionSkeleton from "./StatsSectionSkeleton";

interface StatsSectionProps {
  stats?: {
    totalRevenue?: number;
    totalOrders?: number;
    totalCustomers?: number;
    totalProducts?: number;
  };
  isLoading: boolean;
}

const StatsSection = ({ stats, isLoading }: StatsSectionProps) => {
  const statCards: StatCardData[] = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      iconType: "dollar",
      color: "bg-primary text-primary-content",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      iconType: "shoppingBag",
      color: "bg-accent text-accent-content",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      iconType: "users",
      color: "bg-secondary text-secondary-content",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      iconType: "package",
      color: "bg-info text-info-content",
    },
  ];

  if (isLoading) {
    return <StatsSectionSkeleton />;
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatsCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;