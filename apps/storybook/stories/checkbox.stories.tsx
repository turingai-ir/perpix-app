import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@perpix/ui/components/checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-inset-lg">
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

export const TriStateIndeterminate: Story = {
  render: () => {
    function LayerSelectionTree() {
      const [layers, setLayers] = useState([
        { id: "1", label: "زیرنویس عنوان اصلی", checked: true },
        { id: "2", label: "انیمیشن ورود متن", checked: false },
        { id: "3", label: "افکت هایلایت کلمات", checked: true },
      ]);

      const allChecked = layers.every((l) => l.checked);
      const someChecked = layers.some((l) => l.checked);
      const isIndeterminate = someChecked && !allChecked;

      const handleToggleAll = () => {
        const nextState = !allChecked;
        setLayers((prev) => prev.map((l) => ({ ...l, checked: nextState })));
      };

      const handleToggleLayer = (id: string) => {
        setLayers((prev) =>
          prev.map((l) => (l.id === id ? { ...l, checked: !l.checked } : l)),
        );
      };

      return (
        <div className="flex w-full max-w-xs flex-col gap-3 rounded-panel glass p-4">
          <label className="flex cursor-pointer items-center gap-3 font-semibold text-body select-none pb-2 border-b border-glass-edge-light">
            <Checkbox
              checked={allChecked}
              indeterminate={isIndeterminate}
              onCheckedChange={handleToggleAll}
            />
            <span>انتخاب همه لایه‌ها (Tri-State)</span>
          </label>
          <div className="flex flex-col gap-2.5 ps-6">
            {layers.map((layer) => (
              <label
                key={layer.id}
                className="flex cursor-pointer items-center gap-2.5 text-footnote text-muted-foreground select-none hover:text-foreground"
              >
                <Checkbox
                  checked={layer.checked}
                  onCheckedChange={() => handleToggleLayer(layer.id)}
                />
                <span>{layer.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    return <LayerSelectionTree />;
  },
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <label className="flex cursor-pointer items-center gap-3 select-none">
        <Checkbox error aria-invalid="true" />
        <span className="text-body font-medium text-destructive">
          شرایط و حریم خصوصی را می‌پذیرم
        </span>
      </label>
      <span className="text-caption text-destructive ps-8">
        پذیرش قوانین جهت ادامه فرایند الزامی است.
      </span>
    </div>
  ),
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
