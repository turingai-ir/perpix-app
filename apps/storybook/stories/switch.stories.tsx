import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@perpix/ui/components/switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

function SwitchDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex w-full max-w-xs items-center justify-between gap-4 rounded-card glass p-4">
      <div className="space-y-0.5">
        <span className="text-body font-medium">حذف خودکار سکوت‌ها</span>
        <p className="text-footnote text-muted-foreground">
          فواصل خالی بین صحبت‌ها را حذف می‌کند.
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

export const Default: Story = {
  render: () => <SwitchDemo />,
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch defaultChecked />
      <Switch />
      <Switch disabled defaultChecked />
      <Switch disabled />
    </div>
  ),
};
