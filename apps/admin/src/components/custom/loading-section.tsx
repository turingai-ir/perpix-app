import type { FC } from "react";
import { LoaderCircle } from "lucide-react";

export const LoadingSection: FC = () => (
  <div className="flex h-full min-h-[200px] w-full items-center justify-center p-6">
    <LoaderCircle className="text-primary size-7 animate-spin" />
  </div>
);

export default LoadingSection;
