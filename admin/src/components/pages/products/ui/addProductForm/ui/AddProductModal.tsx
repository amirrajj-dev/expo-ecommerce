import { type RefObject } from "react";
import { X } from "lucide-react";
import { type FormData } from '../types/types'
import ModalHeader from "./ModalHeader";
import FormSection from "./FormSection";
import ImageUploadSection from "./ImageUploadSection";
import FormActions from "./FormActions";

interface AddProductModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  formData: FormData;
  setFormData: (data: FormData) => void;
  previewImages: string[];
  imageFiles: File[];
  setPreviewImages: (images: string[]) => void;
  setImageFiles: (files: File[]) => void;
  isPending: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddProductModal = ({
  dialogRef,
  fileInputRef,
  formData,
  setFormData,
  previewImages,
  imageFiles,
  setPreviewImages,
  setImageFiles,
  isPending,
  onClose,
  onSubmit,
}: AddProductModalProps) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box p-0 bg-linear-to-b from-base-100 to-base-200 border border-base-300 rounded-2xl shadow-2xl max-w-2xl overflow-hidden">
        <div className="relative p-6 bg-linear-to-r from-accent/10 via-secondary/5 to-transparent border-b border-base-300">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-colors"
          >
            <X size={20} className="text-base-content/70" />
          </button>
          <ModalHeader />
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <FormSection formData={formData} setFormData={setFormData} />
            <ImageUploadSection
              fileInputRef={fileInputRef}
              previewImages={previewImages}
              imageFiles={imageFiles}
              setPreviewImages={setPreviewImages}
              setImageFiles={setImageFiles}
            />
            <FormActions onClose={onClose} isPending={isPending} />
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>Close</button>
      </form>
    </dialog>
  );
};

export default AddProductModal;