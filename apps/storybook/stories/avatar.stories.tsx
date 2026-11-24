import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@perpix/ui/components/avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  decorators: [
    (Story) => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 p-inset-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

const sampleImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={sampleImage} alt="پروفایل کاربر" />
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

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs">
        <AvatarImage src={sampleImage} />
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarImage src={sampleImage} />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src={sampleImage} />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={sampleImage} />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src={sampleImage} />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <Avatar status="online" size="lg">
          <AvatarImage src={sampleImage} />
          <AvatarFallback>آنلاین</AvatarFallback>
        </Avatar>
        <span className="text-caption text-success font-medium">آنلاین</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <Avatar status="busy" size="lg">
          <AvatarFallback>مشغول</AvatarFallback>
        </Avatar>
        <span className="text-caption text-destructive font-medium">مشغول</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <Avatar status="away" size="lg">
          <AvatarFallback>غایب</AvatarFallback>
        </Avatar>
        <span className="text-caption text-warning font-medium">در دسترس نیست</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <Avatar status="offline" size="lg">
          <AvatarFallback>آفلاین</AvatarFallback>
        </Avatar>
        <span className="text-caption text-muted-foreground font-medium">آفلاین</span>
      </div>
    </div>
  ),
};

export const AvatarGroupDemo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <span className="text-caption font-medium text-muted-foreground">
        اعضای فعال تیم ویرایش پروژه:
      </span>
      <AvatarGroup>
        <Avatar size="default">
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
          <AvatarFallback>س‌م</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" />
          <AvatarFallback>ع‌ک</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" />
          <AvatarFallback>م‌ر</AvatarFallback>
        </Avatar>
        <div className="flex size-10 pointer-coarse:size-11 items-center justify-center rounded-full glass text-caption font-bold text-foreground">
          +۴
        </div>
      </AvatarGroup>
    </div>
  ),
};

export const AutoInitials: Story = {
  name: "تولید خودکار حروف ابتدایی (Auto Initials from Name)",
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <Avatar name="علی احمدی" size="lg" />
          <span className="text-caption text-muted-foreground">علی احمدی</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Avatar name="سارا محمدی" size="lg" />
          <span className="text-caption text-muted-foreground">سارا محمدی</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Avatar name="John Doe" size="lg" />
          <span className="text-caption text-muted-foreground">John Doe</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Avatar name="PerPix AI" size="lg" />
          <span className="text-caption text-muted-foreground">PerPix AI</span>
        </div>
      </div>
    </div>
  ),
};
