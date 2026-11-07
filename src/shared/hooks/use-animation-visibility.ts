import { useEffect, useState, type RefObject } from "react";
import { useInView } from "motion/react";

export function useAnimationVisibility(ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref);
  const [visible, setVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return inView && visible;
}
