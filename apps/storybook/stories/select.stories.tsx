import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@perpix/ui/components/select";

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="vazir">
      <SelectTrigger>
        <SelectValue placeholder="انتخاب فونت..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>فونت‌های استاندارد فارسی</SelectLabel>
          <SelectItem value="vazir">وزیرمتن (Vazirmatn)</SelectItem>
          <SelectItem value="sahel">ساحل (Sahel)</SelectItem>
          <SelectItem value="shabnam">شبنم (Shabnam)</SelectItem>
          <SelectItem value="samim">صمیم (Samim)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const LongCategorizedList: Story = {
  render: () => (
    <div className="w-full space-y-2">
      <span className="text-caption font-medium text-muted-foreground">
        انتخاب فونت و زبان مدل هوش مصنوعی (لیست دسته‌بندی شده و اسکرول‌دار)
      </span>
      <Select defaultValue="vazir-bold">
        <SelectTrigger>
          <SelectValue placeholder="انتخاب از میان بیش از ۲۰ گزینه..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>فونت‌های فارسی (Vazirmatn Family)</SelectLabel>
            <SelectItem value="vazir-light">وزیرمتن نازک (Light 300)</SelectItem>
            <SelectItem value="vazir-regular">وزیرمتن معمولی (Regular 400)</SelectItem>
            <SelectItem value="vazir-medium">وزیرمتن متوسط (Medium 500)</SelectItem>
            <SelectItem value="vazir-bold">وزیرمتن پررنگ (Bold 700)</SelectItem>
            <SelectItem value="vazir-black">وزیرمتن ضخیم (Black 900)</SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>فونت‌های مکمل فارسی</SelectLabel>
            <SelectItem value="sahel-bold">ساحل بولد (Sahel Bold)</SelectItem>
            <SelectItem value="shabnam-bold">شبنم تیتر (Shabnam Bold)</SelectItem>
            <SelectItem value="samim-regular">صمیم ساده (Samim)</SelectItem>
            <SelectItem value="parastoo">پرستو نمایشی (Parastoo)</SelectItem>
            <SelectItem value="yekan-bakh">یکان‌بخ مدرن (Yekan Bakh)</SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>فونت‌های انگلیسی تیک‌تاک (Latin Display)</SelectLabel>
            <SelectItem value="inter-black">Inter Black (TikTok Style)</SelectItem>
            <SelectItem value="montserrat-extrabold">Montserrat Extra Bold</SelectItem>
            <SelectItem value="bebas-neue">Bebas Neue (Viral Reels)</SelectItem>
            <SelectItem value="anton">Anton Compact</SelectItem>
            <SelectItem value="poppins-bold">Poppins Rounded</SelectItem>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectLabel>مدل‌های پردازش تبدیل صوت به متن (ASR)</SelectLabel>
            <SelectItem value="whisper-large-v3">Whisper Large v3 (دقت حداکثری)</SelectItem>
            <SelectItem value="whisper-turbo">Whisper Turbo (سرعت فوق‌سریع)</SelectItem>
            <SelectItem value="perpix-fast">PerPix Neural Engine v2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-full space-y-1.5">
      <label className="text-footnote font-medium text-foreground">
        قالب زیرنویس الزامی است
      </label>
      <Select>
        <SelectTrigger error aria-invalid="true">
          <SelectValue placeholder="یک استایل انتخاب کنید..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pop">پاپ‌آپ کلمات</SelectItem>
          <SelectItem value="karaoke">کارائوکه رنگی</SelectItem>
          <SelectItem value="minimal">مینیمال شیشه‌ای</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-caption text-destructive font-medium">
        لطفاً برای ادامه استخراج ویدیو، یک قالب زیرنویس معتبر انتخاب فرمایید.
      </p>
    </div>
  ),
};
