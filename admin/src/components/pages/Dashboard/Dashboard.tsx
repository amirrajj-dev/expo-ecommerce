import { useDashboardStats } from "../../../hooks/queries/dashboardStats";
import { useOrders } from "../../../hooks/queries/orders";
import StatsSection from "./ui/StatsSection";
import RecentOrdersSection from "./ui/RecentOrdersSection";

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();

  return (
    <div className="space-y-8 capitalize">
      <StatsSection
        stats={stats?.data}
        isLoading={isLoadingStats}
      />
      
      <RecentOrdersSection
        orders={orders?.data}
        isLoading={isLoadingOrders}
      />
    </div>
  );
}