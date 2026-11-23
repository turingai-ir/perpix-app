import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@perpix/ui/components/dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dialog>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="tinted" />}>
        باز کردن مودال شیشه‌ای
      </DialogTrigger>
      <DialogContent closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>خروجی و ذخیره‌سازی ویدیو</DialogTitle>
          <DialogDescription>
            آیا مایل به ذخیره‌سازی تغییرات و اعمال زیرنویس بر روی ویدیو نهایی
            هستید؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="tinted">تایید و ادامه</Button>
          <DialogClose render={<Button variant="glass" />}>انصراف</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
