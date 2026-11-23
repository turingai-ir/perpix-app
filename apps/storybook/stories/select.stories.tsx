import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@perpix/ui/components/select";

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-xs flex-col items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="vazir">
      <SelectTrigger>
        <SelectValue placeholder="انتخاب فونت..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>فونت‌های استاندارد فارسی</SelectLabel>
          <SelectItem value="vazir">وزیرمتن (Vazirmatn)</SelectItem>
          <SelectItem value="sahel">ساحل (Sahel)</SelectItem>
          <SelectItem value="shabnam">شبنم (Shabnam)</SelectItem>
          <SelectItem value="samim">صمیم (Samim)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
