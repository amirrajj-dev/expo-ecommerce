import { Loader2 } from "lucide-react";
import type { Order, OrderStatus } from "../../../../types/interfaces/order.interface";
import { formatCurrency , formatDate } from "../utils/formatters";
import { getStatusColor, getStatusIcon } from "../utils/statusHelpers";

interface TableRowProps {
  order: Order;
  isSelected: boolean;
  isUpdating: boolean;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const TableRow = ({ order, isSelected, isUpdating, onStatusChange }: TableRowProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(order._id, e.target.value as OrderStatus);
  };

  return (
    <tr className="hover:bg-base-300/30 transition-colors border-b border-base-300 last:border-b-0">
      <OrderIdCell orderId={order._id} />
      <CustomerCell shippingAddress={order.shippingAddress} />
      <ItemsCell items={order.items} />
      <TotalCell total={order.totalPrice} />
      <StatusCell
        status={order.status}
        isSelected={isSelected}
        isUpdating={isUpdating}
        onChange={handleSelectChange}
      />
      <DateCell createdAt={order.createdAt} deliveredAt={order.deliveredAt} />
    </tr>
  );
};

// Sub-components for each cell

const OrderIdCell = ({ orderId }: { orderId: string }) => (
  <td>
    <div className="font-mono text-sm font-medium">{orderId.slice(-8)}</div>
  </td>
);

const CustomerCell = ({ shippingAddress }: { shippingAddress?: any }) => (
  <td>
    <div className="flex flex-col">
      <span className="font-medium">
        {shippingAddress?.fullName || "Guest"}
      </span>
      <span className="text-xs text-base-content/60">
        {shippingAddress
          ? `${shippingAddress.city}, ${shippingAddress.streetAddress}`
          : "N/A"}
      </span>
    </div>
  </td>
);

const ItemsCell = ({ items }: { items: any[] }) => (
  <td>
    <div className="flex flex-col">
      <span className="font-medium">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </span>
      <div className="text-xs text-base-content/60 truncate max-w-[200px]">
        {items[0]?.name}
        {items.length > 1 && ` + ${items.length - 1} more`}
      </div>
    </div>
  </td>
);

const TotalCell = ({ total }: { total: number }) => (
  <td>
    <div className="font-bold text-success">{formatCurrency(total)}</div>
  </td>
);

interface StatusCellProps {
  status: OrderStatus;
  isSelected: boolean;
  isUpdating: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StatusCell = ({ status, isSelected, isUpdating, onChange }: StatusCellProps) => (
  <td>
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={onChange}
        disabled={isSelected || isUpdating}
        className={`select select-bordered select-sm w-full max-w-[140px] ${
          isSelected ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>

      {isSelected ? (
        <Loader2 className="h-4 w-4 animate-spin text-accent" />
      ) : (
        <div className={`badge gap-1.5 ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )}
    </div>
  </td>
);

interface DateCellProps {
  createdAt?: string;
  deliveredAt?: string;
}

const DateCell = ({ createdAt, deliveredAt }: DateCellProps) => (
  <td>
    <div className="flex flex-col">
      <span className="font-medium">{formatDate(createdAt)}</span>
      {deliveredAt && (
        <span className="text-xs text-success">
          Delivered: {formatDate(deliveredAt)}
        </span>
      )}
    </div>
  </td>
);

export default TableRow;