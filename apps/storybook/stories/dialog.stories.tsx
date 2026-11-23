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

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  decorators: [
    (Story) => (
      <div className="flex min-h-[70vh] items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dialog>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="tinted" />}>
        باز کردن مودال شیشه‌ای
      </DialogTrigger>
      <DialogContent closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>خروجی و ذخیره‌سازی ویدیو</DialogTitle>
          <DialogDescription>
            آیا مایل به ذخیره‌سازی تغییرات و اعمال زیرنویس بر روی ویدیو نهایی
            هستید؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="tinted">تایید و ادامه</Button>
          <DialogClose render={<Button variant="glass" />}>انصراف</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DestructiveAlert: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        حذف پروژه (Alert Modal)
      </DialogTrigger>
      <DialogContent closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>حذف دائمی فایل ویدیو</DialogTitle>
          <DialogDescription>
            این فایل و تمامی لایه‌ها و زمان‌بندی‌های زیرنویس پاک خواهند شد. آیا مایل
            به ادامه هستید؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">حذف دائمی</Button>
          <DialogClose render={<Button variant="glass" />}>انصراف</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="glass" />}>
        قوانین و شرایط (Scrollable Mobile Dialog)
      </DialogTrigger>
      <DialogContent closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>شرایط استفاده و حریم خصوصی</DialogTitle>
          <DialogDescription>
            بررسی قابلیت اسکرول محتوای طولانی در صفحه موبایل بدون برش خارج کادر.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-body leading-relaxed text-muted-foreground">
          <p>
            ۱. پردازش صوتی و تبدیل گفتار به متن بر روی سرورهای ابری امن با
            الگوریتم‌های یادگیری عمیق به صورت لحظه‌ای انجام می‌شود.
          </p>
          <p>
            ۲. داده‌های متنی و فایل‌های ویدئویی پس از اتمام پردازش و تایید نهایی
            توسط کاربر، فقط تا موعد انقضای مشخص در پایگاه داده باقی می‌مانند.
          </p>
          <p>
            ۳. طراحی رابط کاربری بر پایه استانداردهای اپل و گوگل (Mobile Native
            First) انجام شده و تمامی عناصر دارای منطقه لمسی بالاتر از ۴۴ پیکسل
            هستند.
          </p>
          <p>
            ۴. هرگونه بازخورد لمسی در کمتر از ۱۰۰ میلی‌ثانیه با انیمیشن‌های نرم
            مبتنی بر CSS بدون فشار بر پردازنده مرکزی گوشی اجرا می‌گردد.
          </p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="tinted" />}>
            پذیرش و ادامه
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
