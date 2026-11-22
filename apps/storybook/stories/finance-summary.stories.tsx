import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheckBig, Hourglass } from "lucide-react";
import { FinanceSummary } from "@perpix/ui/components/finance-summary";

const meta = {
  title: "Finance/Summary",
  component: FinanceSummary,
} satisfies Meta<typeof FinanceSummary>;
export default meta;

export const Payments: StoryObj<typeof meta> = {
  args: {
    items: [
      {
        label: "مجموع پرداخت موفق",
        value: "۸۲۰٬۰۰۰",
        unit: "تومان",
        icon: CircleCheckBig,
        tone: "positive",
      },
      {
        label: "در انتظار پرداخت",
        value: "۲",
        icon: Hourglass,
        tone: "neutral",
      },
      {
        label: "پرداخت ناموفق",
        value: "۱",
        icon: CircleAlert,
        tone: "negative",
      },
    ],
  },
};
