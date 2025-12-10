import { type RefObject } from "react";
import { type Product } from "../../../../../../../../types/interfaces/product.interface";
import { type FormState } from "../types/types";
import ModalHeader from "./ModalHeader";
import ImageSection from "./ImageSelection";
import ProductDetailsForm from "./ProductDetailsForm";
import InfoBox from "./InfoBox";
import FormActions from "./FormActions";

interface EditProductModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isClosing: boolean;
  product: Product;
  formState: FormState;
  previewImages: string[];
  newImages: File[];
  isPending: boolean;
  onBackdropClick: (e: React.MouseEvent) => void;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePreview: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditProductModal = ({
  dialogRef,
  isClosing,
  product,
  formState,
  previewImages,
  newImages,
  isPending,
  onBackdropClick,
  onClose,
  onChange,
  onImageSelect,
  onRemovePreview,
  onSubmit,
}: EditProductModalProps) => {
  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-backdrop" onClick={onBackdropClick} />

      <div
        className={`modal-box p-0 bg-linear-to-b from-base-100 to-base-200 border border-base-300 rounded-2xl shadow-2xl max-w-2xl overflow-hidden transition-all duration-300 ${
          isClosing
            ? "opacity-0 translate-y-6 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <ModalHeader onClose={onClose} />

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-6">
            <ImageSection
              product={product}
              previewImages={previewImages}
              newImages={newImages}
              onImageSelect={onImageSelect}
              onRemovePreview={onRemovePreview}
            />

            <ProductDetailsForm
              formState={formState}
              onChange={onChange}
            />

            <InfoBox />

            <FormActions
              onClose={onClose}
              isPending={isPending}
            />
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditProductModal;