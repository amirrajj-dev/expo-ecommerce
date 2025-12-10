import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { type Product } from "../../../../../../../../types/interfaces/product.interface";

interface ImageSectionProps {
  product: Product;
  previewImages: string[];
  newImages: File[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePreview: (index: number) => void;
}

const ImageSection = ({
  product,
  previewImages,
  newImages,
  onImageSelect,
  onRemovePreview,
}: ImageSectionProps) => {
  const fileInputId = `update-img-${product._id}`;
  const hasNewImages = newImages.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="label text-lg font-semibold text-base-content flex items-center gap-2">
          <ImageIcon size={20} className="text-accent" />
          Product Images
        </label>
        <span className="text-xs text-base-content/50">
          {hasNewImages ? "Replacing images" : "Current images"}
        </span>
      </div>

      <div className="bg-base-200/50 border-2 border-dashed border-base-300 rounded-2xl p-4">
        {previewImages.length > 0 ? (
          <NewImagesGrid
            previewImages={previewImages}
            onRemove={onRemovePreview}
          />
        ) : (
          <CurrentImagesGrid product={product} />
        )}

        <UploadButton
          fileInputId={fileInputId}
          hasNewImages={hasNewImages}
          onImageSelect={onImageSelect}
        />

        {hasNewImages && (
          <div className="mt-2 text-xs text-warning flex items-center gap-1">
            <AlertCircle size={12} />
            New images will replace all existing images
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for new images grid
const NewImagesGrid = ({
  previewImages,
  onRemove,
}: {
  previewImages: string[];
  onRemove: (index: number) => void;
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {previewImages.map((url, i) => (
        <div key={i} className="relative group">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-accent/30">
            <img
              src={url}
              alt={`Preview ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute -top-2 -right-2 btn btn-error btn-circle btn-xs shadow-lg hover:scale-110 transition-transform"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            New image
          </div>
        </div>
      ))}
    </div>
  );
};

// Sub-component for current images grid
const CurrentImagesGrid = ({ product }: { product: Product }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {product.images.map((img) => (
        <div key={img.publicId} className="relative group">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-base-300">
            <img
              src={img.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">
              Current
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Sub-component for upload button
const UploadButton = ({
  fileInputId,
  hasNewImages,
  onImageSelect,
}: {
  fileInputId: string;
  hasNewImages: boolean;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="mt-4 group">
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id={fileInputId}
        onChange={onImageSelect}
      />
      <label
        htmlFor={fileInputId}
        className="btn btn-outline btn-accent w-full gap-2"
      >
        <Upload size={18} />
        {hasNewImages ? "Change Selected Images" : "Upload New Images"}
        <span className="text-xs text-base-content/50 group-hover:text-accent-content">
          (Max 3, 5MB total)
        </span>
      </label>
    </div>
  );
};

export default ImageSection;