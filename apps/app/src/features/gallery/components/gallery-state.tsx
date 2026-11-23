import type { FC, ReactNode } from "react";

import { Muted } from "@/shared/ui/typography";

export const GalleryState: FC<{
  description: string;
  icon: ReactNode;
  title: string;
}> = ({ description, icon, title }) => (
  <div className="flex min-h-80 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
    {icon}
    <div className="text-sm font-medium text-foreground">{title}</div>
    <Muted className="max-w-md">{description}</Muted>
  </div>
);
