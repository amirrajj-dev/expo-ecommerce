import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin text-accent h-12 w-12" />
      <p className="text-base-content/70 text-lg font-medium">
        Loading customers...
      </p>
    </div>
  );
};

export default LoadingState;