import { Tag, DollarSign, Package, FileText } from "lucide-react";
import { categories } from "../../../../../../../../data/data";
import { type FormState } from "../types/types";

interface ProductDetailsFormProps {
  formState: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductDetailsForm = ({ formState, onChange }: ProductDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <label className="label text-lg font-semibold text-base-content">
        Product Details
      </label>

      {/* Name */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={16} className="text-accent" />
          <label className="label-text font-medium">Product Name</label>
        </div>
        <input
          name="name"
          value={formState.name}
          onChange={onChange}
          placeholder="Enter product name"
          className="input outline-none focus:outline-none w-full focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
          required
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PriceField value={formState.price} onChange={onChange} />
        <StockField value={formState.stock} onChange={onChange} />
      </div>

      {/* Category */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
          <Tag size={20} className="text-secondary" />
          Category
        </h4>
        <div className="flex flex-col">
          <select
            name="category"
            value={formState.category}
            onChange={onChange}
            className="select outline-none focus:outline-none w-full focus:select-accent focus:ring-2 focus:ring-accent/20 transition-all"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.value}>
                {cat.content}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-info" />
          <label className="label-text font-medium">Description</label>
        </div>
        <textarea
          name="description"
          rows={4}
          value={formState.description}
          onChange={onChange}
          placeholder="Describe the product in detail..."
          className="textarea outline-none focus:outline-none w-full focus:textarea-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
          maxLength={500}
        />
        <div className="label">
          <span className="label-text-alt text-base-content/50">
            {formState.description.length}/500 characters
          </span>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Price field
const PriceField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={16} className="text-success" />
        <label className="label-text font-medium">Price ($)</label>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
          $
        </span>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={onChange}
          placeholder="0.00"
          className="input outline-none focus:outline-none w-full pl-8 focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>
    </div>
  );
};

// Sub-component for Stock field
const StockField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Package size={16} className="text-accent" />
        <label className="label-text font-medium">Stock</label>
      </div>
      <input
        name="stock"
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        placeholder="Enter stock quantity"
        className="input outline-none focus:outline-none w-full focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
      />
    </div>
  );
};

export default ProductDetailsForm;