import { Calendar } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface RecentOrdersTableProps {
  orders?: any[];
}

const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
  if (!orders?.length) {
    return (
      <div className="bg-base-100 shadow-md border border-base-300 rounded-xl p-8 text-center opacity-70">
        No recent orders
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="overflow-x-auto bg-base-100 shadow-md border border-base-300 rounded-xl">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <OrderTableRow key={order._id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface OrderTableRowProps {
  order: any;
}

const OrderTableRow = ({ order }: OrderTableRowProps) => {
  const formatOrderId = (id: string) => id.substring(0, 8) + "...";
  const getCustomerName = (user: any) => {
    if (typeof user === "string") return user;
    return user?.fullName || "N/A";
  };
  
  const formatItems = (items: any[]) => {
    if (!items?.length) return "No items";
    return `${items[0].name}${
      items.length > 1 ? ` + ${items.length - 1} more` : ""
    }`;
  };

  return (
    <tr>
      <td>{formatOrderId(order._id)}</td>
      <td>{getCustomerName(order.user)}</td>
      <td>{formatItems(order.items)}</td>
      <td>${order.totalPrice}</td>
      <td>
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="flex items-center gap-2">
        <Calendar size={16} />
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A"}
      </td>
    </tr>
  );
};

export default RecentOrdersTable;