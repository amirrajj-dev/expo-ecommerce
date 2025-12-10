import { Info } from "lucide-react";

const InfoBox = () => {
  return (
    <div className="bg-info/10 border border-info/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Info size={20} className="text-info mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-info mb-1">
            Update Information
          </p>
          <p className="text-base-content/80">
            All fields are optional except name. Leaving a field empty
            will keep the current value. Images can be replaced by
            uploading new ones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;