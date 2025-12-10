import { useState } from "react";
import { useUpdateOrderStatus } from "../../../hooks/mutations/update-order-status";
import { useOrders } from "../../../hooks/queries/orders";
import type { OrderStatus } from "../../../types/interfaces/order.interface";
import LoadingState from "./ui/LoadingState";
import OrdersHeader from "./ui/OrdersHeader";
import StatsCards from "./ui/StatsCard";
import OrdersTable from "./ui/OrdersTable";
import FooterInfo from "./ui/FooterInfo";

const Orders = () => {
  const { data: orders, isLoading } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { mutate, isPending: isUpdating } = useUpdateOrderStatus();

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setSelectedOrderId(orderId);
    mutate({ status: newStatus, orderId });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const orderData = orders?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <OrdersHeader />
      <StatsCards orders={orderData} />
      <OrdersTable
        orders={orderData}
        selectedOrderId={selectedOrderId}
        isUpdating={isUpdating}
        onStatusChange={handleStatusChange}
      />
      <FooterInfo orderCount={orderData.length} />
    </div>
  );
};

export default Orders;