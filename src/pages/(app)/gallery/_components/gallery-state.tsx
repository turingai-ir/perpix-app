import type { FC, ReactNode } from "react";

import { Muted } from "@/components/ui/typography";

export const GalleryState: FC<{
  description: string;
  icon: ReactNode;
  title: string;
}> = ({ description, icon, title }) => (
  <div className="text-muted-foreground flex min-h-80 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
    {icon}
    <div className="text-foreground text-sm font-medium">{title}</div>
    <Muted className="max-w-md">{description}</Muted>
  </div>
);
