import { ShoppingBag } from "lucide-react";

interface FooterInfoProps {
  customerCount: number;
}

const FooterInfo = ({ customerCount }: FooterInfoProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/60">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        <span>Showing {customerCount} customers</span>
      </div>
      <div className="flex items-center gap-4">
        <StatusIndicator color="info" label="Has addresses" />
        <StatusIndicator color="accent" label="Has wishlist" />
        <StatusIndicator color="success" label="New today" />
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  color: "info" | "accent" | "success";
  label: string;
}

const StatusIndicator = ({ color, label }: StatusIndicatorProps) => {
  const colorClasses = {
    info: "bg-info",
    accent: "bg-accent",
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