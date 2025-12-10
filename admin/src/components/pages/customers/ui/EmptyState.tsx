import { Users } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Users className="h-12 w-12 text-base-content/30" />
      <p className="text-base-content/70 font-medium">No customers found</p>
      <p className="text-sm text-base-content/50">
        Customers will appear here once they register on your store
      </p>
    </div>
  );
};

export default EmptyState;