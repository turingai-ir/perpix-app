import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@perpix/ui/components/button";
import {
  Dialog,
  DialogBody,
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

export const LongScrollableWithPinnedHeaderFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="glass" />}>
        قوانین و شرایط (Pinned Header/Footer)
      </DialogTrigger>
      <DialogContent size="default" closeLabel="بستن">
        <DialogHeader>
          <DialogTitle>شرایط استفاده و پردازش محتوا</DialogTitle>
          <DialogDescription>
            هدر و فوتر به صورت ثابت قرار گرفته‌اند و فقط متن بدنه اسکرول می‌خورد.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3 text-body leading-relaxed text-muted-foreground">
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
          <p>
            ۵. شفافیت شیشه‌ای مایع (Liquid Glass) در پس‌زمینه‌های تاریک و روشن به
            صورت خودکار شدت نور حاشیه‌ها را کالیبره می‌کند تا از پدیده سیم‌کشی
            سفید جلوگیری شود.
          </p>
          <p>
            ۶. در صورت کاهش اتصال اینترنت، تغییرات در مخزن حافظه محلی کاربر (IndexedDB)
            ذخیره شده و به محض بازیابی شبکه همگام‌سازی می‌شوند.
          </p>
          <p>
            ۷. تمامی لایه‌های تایم‌لاین از شتاب‌دهنده گرافیکی GPU برای رندر ۶۰ فریم
            بر ثانیه بهره می‌برند.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="brand" />}>
            پذیرش کلیه شرایط و ادامه
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="glass" size="sm" />}>
          سایز کوچک (sm)
        </DialogTrigger>
        <DialogContent size="sm" closeLabel="بستن">
          <DialogHeader>
            <DialogTitle>سایز کوچک (Small)</DialogTitle>
            <DialogDescription>مناسب تاییدها و هشدارهای کوتاه.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="tinted" />}>تایید</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="glass" size="sm" />}>
          سایز پیش‌فرض (default)
        </DialogTrigger>
        <DialogContent size="default" closeLabel="بستن">
          <DialogHeader>
            <DialogTitle>سایز پیش‌فرض (Default)</DialogTitle>
            <DialogDescription>مناسب فرم‌ها و فرم‌های تنظیمات معمولی.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="tinted" />}>تایید</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="glass" size="sm" />}>
          سایز بزرگ (lg)
        </DialogTrigger>
        <DialogContent size="lg" closeLabel="بستن">
          <DialogHeader>
            <DialogTitle>سایز بزرگ (Large)</DialogTitle>
            <DialogDescription>مناسب انتخابگر قالب و جدول‌های تنظیمات پیشرفته.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="tinted" />}>تایید</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
