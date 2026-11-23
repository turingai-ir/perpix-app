import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "ذخیره" },
  argTypes: {
    variant: {
      control: "select",
      options: ["glass", "tinted", "destructive", "plain"],
    },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
const row = (
  <div className="flex flex-wrap gap-group">
    <Button variant="tinted">ادامه</Button>
    <Button>انصراف</Button>
    <Button variant="destructive">حذف</Button>
    <Button variant="plain">بیشتر</Button>
    <Button size="icon" aria-label="افزودن">
      <PlusIcon aria-hidden />
    </Button>
    <Button disabled>غیرفعال</Button>
  </div>
);

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <div className="p-inset-lg">{row}</div>
      <div className="bg-(image:--brand-gradient) p-inset-lg">{row}</div>
    </div>
  ),
};
