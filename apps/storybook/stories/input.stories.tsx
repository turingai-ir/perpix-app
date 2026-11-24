import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MagnifyingGlassIcon,
  EnvelopeSimpleIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { Input } from "@perpix/ui/components/input";

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center justify-center gap-4 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Input placeholder="عنوان پروژه ویدیو..." />,
};

function SearchInputDemo() {
  const [query, setQuery] = useState("تولید زیرنویس خودکار هوش مصنوعی");
  return (
    <Input
      startIcon={<MagnifyingGlassIcon size={18} />}
      clearable
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onClear={() => setQuery("")}
      placeholder="جستجو در محتوا..."
    />
  );
}

export const BuiltInIconsAndClear: Story = {
  name: "آیکون‌های درونی و دکمه پاک‌کردن (Icons & Clear)",
  render: () => (
    <div className="w-full space-y-3">
      <SearchInputDemo />

      <Input
        startIcon={<EnvelopeSimpleIcon size={18} />}
        type="email"
        placeholder="ایمیل شما جهت دریافت ویدیو..."
      />

      <Input
        startIcon={<SparkleIcon size={18} className="text-primary" />}
        endIcon={<span className="text-caption text-primary font-semibold">AI Pro</span>}
        placeholder="پرامپت استایل زیرنویس..."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input
      disabled
      startIcon={<MagnifyingGlassIcon size={18} />}
      value="پردازش در حال انجام است..."
    />
  ),
};

export const PasswordAndHelperText: Story = {
  name: "رمز عبور و راهنما (Password Toggle & Helper Text)",
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <Input
        type="password"
        placeholder="رمز عبور خود را وارد کنید..."
        helperText="حداقل شامل ۸ کاراکتر و یک عدد باشد."
      />

      <Input
        type="password"
        value="MySecretPassword123"
        placeholder="رمز عبور..."
      />

      <Input
        error
        type="password"
        value="123"
        errorText="رمز عبور بسیار کوتاه است."
      />
    </div>
  ),
};
