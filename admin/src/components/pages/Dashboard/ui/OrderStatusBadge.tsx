interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "completed":
        return "badge-success";
      case "shipped":
        return "badge-info";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)} capitalize`}>
      {status}
    </span>
  );
};