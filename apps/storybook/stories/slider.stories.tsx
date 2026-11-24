import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@perpix/ui/components/slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center gap-6 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;
export default meta;

type Story = StoryObj<typeof meta>;

function SliderDemo() {
  const [value, setValue] = useState(48);
  return (
    <div className="w-full space-y-2 rounded-card glass p-4">
      <div className="flex justify-between text-footnote">
        <span className="text-muted-foreground">اندازه فونت زیرنویس</span>
        <span className="font-semibold text-primary">{value}px</span>
      </div>
      <Slider
        value={value}
        onValueChange={(val) => typeof val === "number" && setValue(val)}
        min={16}
        max={96}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <SliderDemo />,
};

function SliderBubbleDemo() {
  const [val, setVal] = useState(75);
  return (
    <div className="w-full space-y-5 rounded-card glass p-6">
      <div className="flex justify-between text-footnote">
        <span className="text-muted-foreground">میزان شفافیت شیشه (با حباب شناور)</span>
        <span className="font-semibold text-primary">{val}٪</span>
      </div>
      <Slider
        value={val}
        showValueBubble
        formatValue={(v) => `${v}٪`}
        onValueChange={(newVal) => typeof newVal === "number" && setVal(newVal)}
        min={0}
        max={100}
      />
    </div>
  );
}

export const WithValueBubble: Story = {
  name: "حباب مقدار شناور (Live Value Bubble)",
  render: () => <SliderBubbleDemo />,
};
