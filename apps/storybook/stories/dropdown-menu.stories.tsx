import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CopyIcon,
  EyeIcon,
  TrashIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@perpix/ui/components/dropdown-menu";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="glass" />}>
        منوی عملیات
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>عملیات استودیو</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilSimpleIcon size={16} />
            ویرایش پروژه
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon size={16} />
            تکثیر لایه
            <DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem defaultChecked>
            <EyeIcon size={16} />
            نمایش خطوط راهنما
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon size={16} />
          حذف دائمی
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
