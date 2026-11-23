import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@perpix/ui/components/checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;
export default meta;

type Story = StoryObj<typeof meta>;

function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <label
      htmlFor="effect-checkbox"
      className="flex cursor-pointer items-center gap-3 select-none"
    >
      <Checkbox
        id="effect-checkbox"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <span className="text-body font-medium">
        اعمال افکت رنگی روی کلمه فعال
      </span>
    </label>
  );
}

export const Default: Story = {
  render: () => <CheckboxDemo />,
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox defaultChecked />
      <Checkbox />
      <Checkbox disabled defaultChecked />
      <Checkbox disabled />
    </div>
  ),
};
