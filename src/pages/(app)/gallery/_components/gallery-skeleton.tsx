import { Skeleton } from "@/components/ui/skeleton";

export const GallerySkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <Skeleton key={index} className="aspect-square rounded-lg" />
    ))}
  </div>
);
