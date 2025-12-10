import { useState, useEffect, useRef, useCallback } from "react";
import { useUpdateProduct } from "../../../../../../../hooks/mutations/update-product";
import { toast } from "sonner";
import type { Product } from "../../../../../../../types/interfaces/product.interface";
import EditProductModal from "./ui/EditProductModal";
import { type FormState } from "./types/types";

interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const EditProductForm = ({
  isOpen,
  product,
  onClose,
}: EditProductFormProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { mutate, isPending } = useUpdateProduct(product._id);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
   const [formState, setFormState] = useState<FormState>({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: product?.category || "",
    description: product?.description || "",
  });

  const closeAnimated = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current.open) {
      // Close immediately without animation
      dialogRef.current.close();
      onClose();
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeAnimated();
      }
    },
    [closeAnimated]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      toast.error("Images too large (max 5MB total)");
      return;
    }

    setNewImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const removePreview = (index: number) => {
    setPreviewImages((prev: string[]) => prev.filter((_, i) => i !== index));
    setNewImages((prev: File[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (value.trim() !== "") formData.append(key, value);
    });

    if (newImages.length > 0) {
      newImages.forEach((img) => formData.append("images", img));
    }

    mutate(formData, {
      onSuccess: closeAnimated,
    });
  };

  if (!product) return null;

  return (
    <EditProductModal
      dialogRef={dialogRef}
      isClosing={isClosing}
      product={product}
      formState={formState}
      previewImages={previewImages}
      newImages={newImages}
      isPending={isPending}
      onBackdropClick={handleBackdropClick}
      onClose={closeAnimated}
      onChange={handleChange}
      onImageSelect={handleImageSelect}
      onRemovePreview={removePreview}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProductForm;
