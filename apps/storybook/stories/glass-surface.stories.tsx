import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlassSurface } from "@perpix/ui/components/glass-surface";

const meta = {
  title: "Components/GlassSurface",
  component: GlassSurface,
  args: { intensity: "soft" },
  argTypes: {
    intensity: { control: "inline-radio", options: ["soft", "flat"] },
  },
  decorators: [
    (Story) => (
      <div className="grid min-h-svh place-items-center bg-(image:--brand-gradient) p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GlassSurface>;
export default meta;

type Story = StoryObj<typeof meta>;

const content = (
  <div className="flex flex-col gap-group p-inset-lg">
    <p className="text-headline">زیرنویس ویدیو</p>
    <p className="text-subhead text-muted-foreground">
      سطح شیشه‌ای سبک روی پس‌زمینهٔ رنگی
    </p>
  </div>
);

export const Soft: Story = { args: { children: content } };
export const Flat: Story = { args: { intensity: "flat", children: content } };
