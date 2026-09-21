import type { ReactNode } from "react";
import { motion } from "motion/react";

export function CheckoutStepMotion({
  children,
  stepKey,
}: {
  children: ReactNode;
  stepKey: string;
}) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
