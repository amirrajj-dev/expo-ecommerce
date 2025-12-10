import { Package } from "lucide-react";

const ModalHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 bg-accent/20 rounded-2xl">
        <Package size={28} className="text-accent" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-base-content">
          Add New Product
        </h3>
        <p className="text-sm text-base-content/70 mt-1">
          Fill in the product details below
        </p>
      </div>
    </div>
  );
};

export default ModalHeader;