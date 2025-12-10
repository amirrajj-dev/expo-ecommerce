import { X, Pencil, Loader2 } from "lucide-react";

interface FormActionsProps {
  onClose: () => void;
  isPending: boolean;
}

const FormActions = ({ onClose, isPending }: FormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-base-300">
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost flex-1 gap-2 hover:bg-base-300 transition-all"
      >
        <X size={18} />
        Cancel
      </button>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-accent text-accent-content flex-1 gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Saving Changes...
          </>
        ) : (
          <>
            <Pencil size={18} />
            Update Product
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;