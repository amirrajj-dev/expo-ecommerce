import { useEffect, useRef, useState, useCallback } from "react";
import { useDeleteProduct } from "../../../../../../../hooks/mutations/delete-product";
import { Loader2, Trash2, AlertTriangle, X, ShieldAlert } from "lucide-react";
import type { Product } from "../../../../../../../types/interfaces/product.interface";

interface DeleteProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const DeleteProductForm = ({
  product,
  isOpen,
  onClose,
}: DeleteProductFormProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);
  const { mutate, isPending } = useDeleteProduct({
    onSuccess : close
  });


  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    }
  }, [isOpen, close]); // Add close to dependencies

  const handleDelete = () => {
    mutate(product._id);
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div
        className={`modal-box p-0 bg-linear-to-b from-base-100 to-base-200 border-2 border-error/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isClosing
            ? "opacity-0 translate-y-6 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Modal Header */}
        <div className="relative p-6 bg-linear-to-r from-error/10 via-error/5 to-transparent border-b border-error/20">
          <button
            onClick={close}
            className="absolute right-4 top-4 btn btn-ghost btn-circle btn-sm hover:bg-error/10 transition-colors"
          >
            <X size={20} className="text-base-content/70" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-error/20 rounded-2xl">
              <ShieldAlert size={28} className="text-error" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-error">Delete Product</h3>
              <p className="text-sm text-base-content/70 mt-1">
                Permanent action
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-error/5 rounded-xl border border-error/20">
            <AlertTriangle size={20} className="text-error mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-error">
                Warning: This cannot be undone
              </p>
              <p className="text-sm text-base-content/80 mt-1">
                All product data, images, and associated information will be
                permanently removed from the system.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-base-content">
              What will be deleted:
            </h4>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-error rounded-full" />
                Product details and specifications
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-error rounded-full" />
                Product images and media files
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-error rounded-full" />
                Pricing and inventory data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-error rounded-full" />
                Category associations
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-4 border-t border-base-300 bg-base-200/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={close}
              className="btn btn-outline flex-1 gap-2 hover:bg-base-300 transition-all"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              className="btn btn-error text-error-content flex-1 gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete Permanently
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-center text-base-content/60 mt-4">
            By clicking "Delete Permanently", you acknowledge this action cannot
            be reversed.
          </p>
        </div>
      </div>

      {/* Backdrop with better styling */}
      <form method="dialog" className="modal-backdrop" onClick={close}>
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  );
};

export default DeleteProductForm;
