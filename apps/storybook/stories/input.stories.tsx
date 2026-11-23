import type { Meta, StoryObj } from "@storybook/react-vite";
import { MagnifyingGlassIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { Input } from "@perpix/ui/components/input";

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center gap-4 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Input placeholder="عنوان پروژه ویدیو..." />,
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-full space-y-3">
      <div className="relative">
        <MagnifyingGlassIcon
          size={18}
          className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input placeholder="جستجو در ترانسکریپت‌ها..." className="ps-10" />
      </div>

      <div className="relative">
        <EnvelopeSimpleIcon
          size={18}
          className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input type="email" placeholder="ایمیل شما..." className="ps-10" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <Input disabled value="پردازش در حال انجام است..." />,
};
