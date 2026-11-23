import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@perpix/ui/components/tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center p-inset-lg">
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="glass" />}>
        واگرد (Undo)
      </TooltipTrigger>
      <TooltipContent>کلید میانبر: Ctrl+Z</TooltipContent>
    </Tooltip>
  ),
};
