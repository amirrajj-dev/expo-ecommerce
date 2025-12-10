import { Clock, Truck, CheckCircle } from "lucide-react";
import type { OrderStatus } from "../../../../types/interfaces/order.interface";

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "badge-warning text-warning-content";
    case "shipped":
      return "badge-info text-info-content";
    case "delivered":
      return "badge-success text-success-content";
    default:
      return "badge-neutral text-neutral-content";
  }
};

export const getStatusIcon = (status: OrderStatus): React.ReactNode => {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "shipped":
      return <Truck className="h-3 w-3" />;
    case "delivered":
      return <CheckCircle className="h-3 w-3" />;
    default:
      return null;
  }
};