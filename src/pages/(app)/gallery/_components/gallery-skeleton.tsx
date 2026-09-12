import { Skeleton } from "@/components/ui/skeleton";
import styles from "../gallery.module.css";

export const GallerySkeleton = () => (
  <div className={styles.grid} aria-hidden="true">
    {Array.from({ length: 12 }).map((_, index) => (
      <Skeleton
        key={index}
        className="aspect-[4/3] rounded-2xl motion-reduce:animate-none"
      />
    ))}
  </div>
);
