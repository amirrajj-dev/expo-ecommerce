import { Pencil, X } from "lucide-react";

interface ModalHeaderProps {
  onClose: () => void;
}

const ModalHeader = ({ onClose }: ModalHeaderProps) => {
  return (
    <div className="relative p-6 bg-linear-to-r from-accent/10 via-secondary/5 to-transparent border-b border-base-300">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-colors"
      >
        <X size={20} className="text-base-content/70" />
      </button>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent/20 rounded-2xl">
          <Pencil size={28} className="text-accent" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-base-content">
            Edit Product
          </h3>
          <p className="text-sm text-base-content/70 mt-1">
            Update product information
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;