import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@perpix/ui/components/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from "@perpix/ui/components/sheet";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@perpix/ui/components/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@perpix/ui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@perpix/ui/components/dropdown-menu";

const meta = {
  title: "Components/Overlays",
  decorators: [
    (Story) => (
      <div className="flex min-h-svh flex-wrap content-center justify-center gap-group bg-(image:--brand-gradient) p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const DialogStory: Story = {
  name: "Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>حذف پروژه</DialogTrigger>
      <DialogContent closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>پروژه حذف شود؟</DialogTitle>
          <DialogDescription>این کار قابل بازگشت نیست.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">حذف</Button>
          <DialogClose render={<Button />}>انصراف</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

const sides: SheetSide[] = ["bottom", "inline-end", "inline-start", "top"];
export const SheetStory: Story = {
  name: "Sheet",
  render: () => (
    <>
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button />}>{side}</SheetTrigger>
          <SheetContent side={side} closeLabel="بستن">
            <SheetHeader>
              <SheetTitle>تنظیمات زیرنویس</SheetTitle>
              <SheetDescription>
                فونت، اندازه و رنگ را انتخاب کنید.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </>
  ),
};

export const PopoverStory: Story = {
  name: "Popover",
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button />}>اطلاعات</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>اعتبار باقی‌مانده</PopoverTitle>
        <PopoverDescription>۱۲۰ اعتبار تا پایان ماه</PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const TooltipStory: Story = {
  name: "Tooltip",
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button />}>واگرد</TooltipTrigger>
        <TooltipContent>Ctrl+Z</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const MenuStory: Story = {
  name: "DropdownMenu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>گزینه‌ها</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>ویرایش</DropdownMenuLabel>
          <DropdownMenuItem>
            تکثیر<DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem defaultChecked>
            نمایش خط‌راهنما
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
