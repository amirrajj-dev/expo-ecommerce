import { useRef, useState } from "react";
import { useCreateProduct } from "../../../../../hooks/mutations/create-product";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import AddProductModal from "./ui/AddProductModal";
import { type FormData } from "./types/types";

const AddProductForm = () => {
  const { mutate, isPending } = useCreateProduct();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const open = () => dialogRef.current?.showModal();
  const close = () => {
    dialogRef.current?.close();
    resetForm();
  };

  const resetForm = () => {
    setPreviewImages([]);
    setImageFiles([]);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitFormData = createFormData();
    mutate(submitFormData, { onSuccess: close });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    return true;
  };

  const createFormData = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    imageFiles.forEach((file) => data.append("images", file));
    return data;
  };

  return (
    <>
      <button
        onClick={open}
        className="group btn btn-accent gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <Plus
          size={20}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
        <span>Add New Product</span>
      </button>

      <AddProductModal
        dialogRef={dialogRef}
        fileInputRef={fileInputRef}
        formData={formData}
        setFormData={setFormData}
        previewImages={previewImages}
        imageFiles={imageFiles}
        setPreviewImages={setPreviewImages}
        setImageFiles={setImageFiles}
        isPending={isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddProductForm;