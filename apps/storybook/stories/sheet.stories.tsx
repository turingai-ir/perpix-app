import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from "@perpix/ui/components/sheet";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center gap-group p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sheet>;
export default meta;

type Story = StoryObj<typeof meta>;

const sides: SheetSide[] = ["bottom", "inline-end", "inline-start", "top"];

export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="tinted" />}>
        تنظیمات پروژه (Bottom Sheet)
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel="بستن">
        <SheetHeader>
          <SheetTitle>تنظیمات قالب زیرنویس</SheetTitle>
          <SheetDescription>
            برای بستن می‌توانید دستگیره بالا را به سمت پایین بکشید (Swipe down to
            dismiss).
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-group py-inset">
          <Button variant="glass" className="justify-start">
            استایل فونت وزیرمتن با وزن نیمه‌پر (SemiBold)
          </Button>
          <Button variant="glass" className="justify-start">
            انیمیشن کلمات به سبک تیک‌تاک (Pop Animation)
          </Button>
          <Button variant="glass" className="justify-start">
            رنگ گرادیان بنفش-سرخابی برند پرپیکس
          </Button>
        </div>
        <SheetFooter>
          <Button variant="brand">اعمال روی تمام کلیپ‌ها</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LongScrollableWithPinnedHeaderFooter: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="glass" />}>
        لیست طولانی با بدنه اسکرولی (Long Content Sheet)
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel="بستن">
        <SheetHeader>
          <SheetTitle>انتخاب پالت رنگ و انیمیشن</SheetTitle>
          <SheetDescription>
            دستگیره بالا و دکمه‌های پایین ثابت می‌مانند؛ لیست طولانی در بدنه اسکرول
            می‌خورد.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-2 py-2">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-control glass-subtle"
            >
              <div className="flex flex-col">
                <span className="font-medium text-body">
                  قالب پریست شماره {i + 1}
                </span>
                <span className="text-caption text-muted-foreground">
                  سرعت انیمیشن: {100 + i * 20}ms | کنتراست شیشه: عالی
                </span>
              </div>
              <Button size="sm" variant="tinted">
                انتخاب
              </Button>
            </div>
          ))}
        </SheetBody>
        <SheetFooter>
          <Button variant="brand">ذخیره و اعمال نهایی</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const DestructiveConfirmationSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="destructive" />}>
        تایید حذف در موبایل (Bottom Sheet Action)
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel="بستن">
        <SheetHeader>
          <SheetTitle>حذف لایه زیرنویس فعلی</SheetTitle>
          <SheetDescription>
            در طراحی‌های بومی موبایل، تاییدیه‌های مهم و حذف به صورت Bottom Sheet
            در دسترس انگشت شست قرار می‌گیرند.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-group py-2">
          <Button variant="destructive">تایید حذف قطعی لایه</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-group">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="glass" />}>
            جهت {side}
          </SheetTrigger>
          <SheetContent side={side} closeLabel="بستن">
            <SheetHeader>
              <SheetTitle>پنل کشویی {side}</SheetTitle>
              <SheetDescription>
                نمایش باز شدن Sheet از جهت {side}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
