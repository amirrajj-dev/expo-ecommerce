import { DollarSign, Layers } from "lucide-react";
import { type FormData } from "../../types/types";

interface PricingFieldsProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingFields = ({ formData, onChange }: PricingFieldsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
        <DollarSign size={20} className="text-success" />
        Pricing & Inventory
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label font-medium text-base-content/90 flex items-center gap-2">
            <DollarSign size={16} />
            Price ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
              $
            </span>
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={onChange}
              className="input outline-none focus:outline-none w-full pl-8 focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="label font-medium text-base-content/90 flex items-center gap-2">
            <Layers size={16} />
            Stock Quantity
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Enter quantity"
            value={formData.stock}
            onChange={onChange}
            className="input outline-none focus:outline-none w-full focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PricingFields;