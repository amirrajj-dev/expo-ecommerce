import { Package, FileText, Info } from "lucide-react";
import { type FormData } from "../../types/types";

interface BasicInfoFieldsProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoFields = ({ formData, onChange }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
        <Info size={20} className="text-accent" />
        Basic Information
      </h4>

      <div className="flex flex-col gap-1">
        <label className="label font-medium text-base-content/90 flex items-center gap-2">
          <Package size={16} />
          Product Name
        </label>
        <input
          name="name"
          type="text"
          placeholder="Enter product name"
          value={formData.name}
          onChange={onChange}
          className="input outline-none focus:outline-none w-full focus:input-accent focus:ring-2 focus:ring-accent/20 transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="label font-medium text-base-content/90 flex items-center gap-2">
          <FileText size={16} />
          Description
        </label>
        <textarea
          name="description"
          placeholder="Describe the product features, benefits, and specifications..."
          value={formData.description}
          onChange={onChange}
          rows={3}
          className="textarea outline-none focus:outline-none w-full focus:textarea-accent focus:ring-2 focus:ring-accent/20 transition-all"
          required
          maxLength={700}
        />
        <div className="label">
          <span className="label-text-alt text-base-content/50">
            {formData.description.length}/700 characters
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoFields;