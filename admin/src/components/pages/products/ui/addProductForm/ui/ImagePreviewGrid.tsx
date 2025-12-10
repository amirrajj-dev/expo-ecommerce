import { X } from "lucide-react";

interface ImagePreviewGridProps {
  previewImages: string[];
  onRemove: (index: number) => void;
}

const ImagePreviewGrid = ({ previewImages, onRemove }: ImagePreviewGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {previewImages.map((url, index) => (
        <div key={index} className="relative group">
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-accent/30">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 btn btn-error btn-circle btn-xs shadow-lg hover:scale-110 transition-transform"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviewGrid;