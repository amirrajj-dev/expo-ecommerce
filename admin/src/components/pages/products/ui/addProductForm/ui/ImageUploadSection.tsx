import { type RefObject } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ImagePreviewGrid from "./ImagePreviewGrid";
import UploadArea from "./UploadArea";

interface ImageUploadSectionProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  previewImages: string[];
  imageFiles: File[];
  setPreviewImages: (images: string[]) => void;
  setImageFiles: (files: File[]) => void;
}

const ImageUploadSection = ({
  fileInputRef,
  previewImages,
  imageFiles,
  setPreviewImages,
  setImageFiles,
}: ImageUploadSectionProps) => {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    if (files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      toast.error("Total file size too large (max 5MB)");
      return;
    }

    const newImageFiles: File[] = [...imageFiles, ...files];
    const uniqueFiles = Array.from(
      new Set(newImageFiles.map((file) => file.name))
    ).map((name) => newImageFiles.find((file) => file.name === name) as File);

    const finalFiles = uniqueFiles.slice(0, 3);
    setImageFiles(finalFiles);
    setPreviewImages(finalFiles.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const newPreviewImages = previewImages.filter((_ , i)=> i !== index)
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    setPreviewImages(newPreviewImages);
    setImageFiles(newImageFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-base-content flex items-center gap-2">
        <ImageIcon size={20} className="text-accent" />
        Product Images
      </h4>

      <div className="bg-base-200/50 border-2 border-dashed border-base-300 rounded-2xl p-6">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {previewImages.length === 0 ? (
          <UploadArea onClick={triggerFileInput} />
        ) : (
          <>
            <ImagePreviewGrid
              previewImages={previewImages}
              onRemove={removeImage}
            />
            <div className="mt-4">
              <button
                type="button"
                onClick={triggerFileInput}
                className="btn btn-outline btn-accent w-full gap-2"
                disabled={previewImages.length >= 3}
              >
                <Upload size={16} />
                {previewImages.length >= 3
                  ? "Maximum 3 images reached"
                  : "Add More Images"}
              </button>
              <p className="text-xs text-base-content/50 text-center mt-2">
                {previewImages.length} of 3 images selected
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;