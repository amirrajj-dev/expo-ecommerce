import { Upload } from "lucide-react";

interface UploadAreaProps {
  onClick: () => void;
}

const UploadArea = ({ onClick }: UploadAreaProps) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-base-300/30 rounded-xl transition-colors"
    >
      <div className="p-4 bg-accent/20 rounded-2xl mb-3">
        <Upload size={32} className="text-accent" />
      </div>
      <p className="font-medium text-base-content mb-1">
        Click to upload images
      </p>
      <p className="text-sm text-base-content/60 text-center">
        Upload up to 3 images (JPG, PNG, WebP) <br />
        Max 5MB total size
      </p>
      <button
        type="button"
        className="btn btn-outline btn-accent mt-4 gap-2"
      >
        <Upload size={16} />
        Browse Files
      </button>
    </div>
  );
};

export default UploadArea;