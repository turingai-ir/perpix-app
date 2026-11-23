import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@perpix/ui/components/popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="glass" />}>
        نمایش اطلاعات شیشه‌ای
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>اعتبار باقی‌مانده حساب</PopoverTitle>
        <PopoverDescription>
          شما ۱۲۰ دقیقه اعتبار پردازش زیرنویس هوشمند تا پایان ماه جاری در اختیار
          دارید.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};
