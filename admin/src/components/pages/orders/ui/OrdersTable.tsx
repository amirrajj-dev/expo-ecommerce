import type { Order, OrderStatus } from '../../../../types/interfaces/order.interface'
import TableHeader from './TableHeder';
import TableRow from './TableRow';
import EmptyState from './EmptyState';

interface OrdersTableProps {
  orders: Order[];
  selectedOrderId: string | null;
  isUpdating: boolean;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrdersTable = ({
  orders,
  selectedOrderId,
  isUpdating,
  onStatusChange,
}: OrdersTableProps) => {
  return (
    <div className="bg-linear-to-br from-base-100 to-base-200 border border-base-300 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <TableHeader />
          <tbody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                order={order}
                isSelected={selectedOrderId === order._id}
                isUpdating={isUpdating}
                onStatusChange={onStatusChange}
              />
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;