import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@perpix/ui/components/avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] items-center justify-center gap-4 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          alt="پروفایل کاربر"
        />
        <AvatarFallback>س‌م</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>ام</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-primary font-bold text-primary-foreground">
          P
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
