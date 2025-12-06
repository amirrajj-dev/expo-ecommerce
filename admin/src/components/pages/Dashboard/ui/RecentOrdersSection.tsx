import RecentOrdersTable from "./RecentOrdersTable";
import RecentOrdersSkeleton from "./RecentOrdersSkeleton";
import type { Order } from "../../../../types/interfaces/order.interface";

interface RecentOrdersSectionProps {
  orders?: Order[];
  isLoading: boolean;
}

const RecentOrdersSection = ({ orders, isLoading }: RecentOrdersSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      {isLoading ? (
        <RecentOrdersSkeleton />
      ) : (
        <RecentOrdersTable orders={orders} />
      )}
    </section>
  );
};

export default RecentOrdersSection;