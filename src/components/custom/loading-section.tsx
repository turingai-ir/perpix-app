import type { FC } from "react";
import { LoaderCircle } from "lucide-react";

const LoadingSection: FC = () => (
  <LoaderCircle className="h-7 w-7 animate-spin" />
);

export default LoadingSection;
