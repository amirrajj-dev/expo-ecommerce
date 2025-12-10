import { Tag } from "lucide-react";
import { categories } from "../../../../../../../data/data";
import { type FormData } from "../../types/types";

interface CategoryFieldProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoryField = ({ formData, onChange }: CategoryFieldProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
        <Tag size={20} className="text-secondary" />
        Category
      </h4>

      <div className="flex flex-col gap-1">
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className="select outline-none focus:outline-none w-full focus:select-accent focus:ring-2 focus:ring-accent/20 transition-all"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.value}>
              {cat.content}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryField;