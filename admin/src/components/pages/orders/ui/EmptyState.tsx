import { Package } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Package className="h-12 w-12 text-base-content/30" />
      <p className="text-base-content/70 font-medium">No orders found</p>
      <p className="text-sm text-base-content/50">
        Orders will appear here once customers make purchases
      </p>
    </div>
  );
};

export default EmptyState;