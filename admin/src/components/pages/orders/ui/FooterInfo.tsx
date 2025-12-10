import { Clock } from "lucide-react";

interface FooterInfoProps {
  orderCount: number;
}

const FooterInfo = ({ orderCount }: FooterInfoProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/60">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Showing {orderCount} orders</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusIndicator color="warning" label="Pending" />
        <StatusIndicator color="info" label="Shipped" />
        <StatusIndicator color="success" label="Delivered" />
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  color: "warning" | "info" | "success";
  label: string;
}

const StatusIndicator = ({ color, label }: StatusIndicatorProps) => {
  const colorClasses = {
    warning: "bg-warning",
    info: "bg-info",
    success: "bg-success",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`}></div>
      <span>{label}</span>
    </div>
  );
};

export default FooterInfo;