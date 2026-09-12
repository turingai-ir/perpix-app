import { useState } from "react";
import { Sparkles } from "lucide-react";
import { SiGoogle, SiOpenai } from "react-icons/si";

// OpenAI/Google: Simple Icons. Other provider marks are official site favicons.
export function ImageModelLogo({ name }: { name: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  if (name.startsWith("OPENAI_") || name.startsWith("OPEN_AI"))
    return <SiOpenai className="size-5 shrink-0" aria-hidden="true" />;
  if (name.startsWith("GOOGLE_"))
    return <SiGoogle className="size-5 shrink-0" aria-hidden="true" />;
  let source: string | undefined;
  if (name.startsWith("BLACK_FOREST_LABS"))
    source = "/images/model-logos/bfl.svg";
  if (name.startsWith("IDEOGRAM")) source = "/images/model-logos/ideogram.ico";
  if (!source || failedSource === source)
    return <Sparkles className="size-5 shrink-0" aria-hidden="true" />;
  return (
    <img
      src={source}
      alt=""
      className="size-6 shrink-0 rounded object-contain"
      onError={() => setFailedSource(source)}
    />
  );
}
