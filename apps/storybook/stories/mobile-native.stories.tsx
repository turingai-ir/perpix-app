import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HouseIcon,
  VideoCameraIcon,
  FolderSimpleIcon,
  UserIcon,
  SparkleIcon,
  SlidersHorizontalIcon,
  TrashIcon,
  CheckIcon,
  PlayIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react";
import { Button } from "@perpix/ui/components/button";
import { GlassSurface } from "@perpix/ui/components/glass-surface";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@perpix/ui/components/sheet";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@perpix/ui/components/dropdown-menu";

const meta = {
  title: "Experience/Mobile Native App",
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "iphone15",
    },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

function MobileAppExperienceView() {
  const [activeTab, setActiveTab] = useState<
    "home" | "studio" | "projects" | "profile"
  >("studio");
  const [selectedStyle, setSelectedStyle] = useState("تایپ‌رایتر مدرن");

  return (
    <div className="relative mx-auto flex h-dvh max-w-[390px] flex-col overflow-hidden bg-background text-foreground shadow-2xl">
      {/* Top Floating Glass Navigation Bar (Safe Area Top) */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b glass border-border/40 px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-control bg-primary text-headline font-bold text-primary-foreground">
            P
          </span>
          <span className="text-headline font-semibold">استودیو پرپیکس</span>
        </div>

        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="glass"
                  size="icon-sm"
                  aria-label="تنظیمات استودیو"
                />
              }
            >
              <SlidersHorizontalIcon size={18} />
            </SheetTrigger>
            <SheetContent side="bottom" closeLabel="بستن">
              <SheetHeader>
                <SheetTitle>تنظیمات هوش مصنوعی و زیرنویس</SheetTitle>
                <SheetDescription>
                  قالب و شیوه متحرک‌سازی زیرنویس خودکار ویدیو را برگزینید.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-group py-2">
                {[
                  "تایپ‌رایتر مدرن",
                  "کلمات متحرک پاپ‌آپ (Viral TikTok)",
                  "حباب شیشه‌ای نئونی",
                  "زیرنویس رسمی سازمانی",
                ].map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? "tinted" : "glass"}
                    className="justify-between text-body"
                    onClick={() => setSelectedStyle(style)}
                  >
                    <span>{style}</span>
                    {selectedStyle === style ? (
                      <CheckIcon size={18} weight="bold" />
                    ) : null}
                  </Button>
                ))}
              </div>

              <SheetFooter>
                <SheetClose
                  render={<Button variant="brand" className="w-full" />}
                >
                  ذخیره و اعمال تنظیمات
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="plain"
                  size="icon-sm"
                  aria-label="گزینه‌های بیشتر"
                />
              }
            >
              <DotsThreeVerticalIcon size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <SparkleIcon size={16} />
                بهینه‌سازی خودکار صدا
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashIcon size={16} />
                پاک‌سازی تاریخچه
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Scrollable Content Body with native touch momentum */}
      <main className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 pb-28">
        {/* Hero Video Preview Card */}
        <GlassSurface className="space-y-3 overflow-hidden p-4 shadow-raised">
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-control bg-neutral-900">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <Button
              variant="brand"
              shape="pill"
              size="icon-lg"
              aria-label="پخش پیش‌نمایش"
              className="z-10 shadow-overlay"
            >
              <PlayIcon size={26} weight="fill" />
            </Button>
            <div className="absolute start-3 end-3 bottom-2.5 flex items-center justify-between text-caption text-white/90">
              <span className="font-medium">۰۱:۲۴ / ۰۳:۴۵</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 backdrop-blur-md">
                1080p 60fps
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-title-3 font-semibold">
              پروژه تولید پادکست تصویری
            </h2>
            <p className="text-body text-muted-foreground">
              استایل فعال:{" "}
              <span className="font-medium text-foreground">
                {selectedStyle}
              </span>
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="brand" className="flex-1 gap-1.5">
              <SparkleIcon size={18} />
              تولید زیرنویس با هوش مصنوعی
            </Button>

            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="حذف پروژه"
                  />
                }
              >
                <TrashIcon size={18} />
              </DialogTrigger>
              <DialogContent closeLabel="بستن">
                <DialogHeader>
                  <DialogTitle>حذف دائمی این پروژه؟</DialogTitle>
                  <DialogDescription>
                    آیا از حذف این ویدیو و تمامی زیرنویس‌های پردازش شده اطمینان
                    دارید؟ این عملیات غیرقابل بازگشت است.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive">بله، حذف کن</Button>
                  <DialogClose render={<Button variant="glass" />}>
                    انصراف
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </GlassSurface>

        {/* Quick Action Chips */}
        <div className="space-y-2">
          <h3 className="text-headline font-semibold text-muted-foreground">
            ابزارهای سریع لمسی
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="glass"
              className="h-16 flex-col items-center justify-center gap-1 rounded-control text-footnote"
            >
              <SparkleIcon size={20} className="text-primary" />
              <span>برش سکوت‌ها</span>
            </Button>
            <Button
              variant="glass"
              className="h-16 flex-col items-center justify-center gap-1 rounded-control text-footnote"
            >
              <VideoCameraIcon size={20} className="text-cyan-500" />
              <span>تنظیم کادر عمودی (۹:۱۶)</span>
            </Button>
          </div>
        </div>

        {/* Recent Transcripts List */}
        <div className="space-y-2">
          <h3 className="text-headline font-semibold text-muted-foreground">
            بخش‌های اخیر زیرنویس
          </h3>
          {[
            { time: "۰۰:۱۲", text: "به قسمت جدید پادکست پرپیکس خوش آمدید." },
            {
              time: "۰۰:۱۸",
              text: "امروز درباره نسل جدید رابط‌های کاربری مایع صحبت می‌کنیم.",
            },
            {
              time: "۰۰:۲۷",
              text: "شفافیت شیشه، شکست نور و سرعت احساس لمس بومی موبایل.",
            },
          ].map((item, idx) => (
            <GlassSurface
              key={idx}
              className="flex items-start gap-3 p-3 text-body"
            >
              <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-caption font-semibold text-primary">
                {item.time}
              </span>
              <p className="flex-1 text-body leading-relaxed">{item.text}</p>
            </GlassSurface>
          ))}
        </div>
      </main>

      {/* Fixed Floating Bottom Tab Bar (Safe Area Bottom) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[390px] border-t glass border-border/40 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="grid grid-cols-4 items-center justify-items-center">
          <Button
            variant="plain"
            className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-none text-caption ${
              activeTab === "home"
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <HouseIcon
              size={22}
              weight={activeTab === "home" ? "fill" : "regular"}
            />
            <span>خانه</span>
          </Button>

          <Button
            variant="plain"
            className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-none text-caption ${
              activeTab === "studio"
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("studio")}
          >
            <VideoCameraIcon
              size={22}
              weight={activeTab === "studio" ? "fill" : "regular"}
            />
            <span>استودیو</span>
          </Button>

          <Button
            variant="plain"
            className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-none text-caption ${
              activeTab === "projects"
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <FolderSimpleIcon
              size={22}
              weight={activeTab === "projects" ? "fill" : "regular"}
            />
            <span>پروژه‌ها</span>
          </Button>

          <Button
            variant="plain"
            className={`flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-none text-caption ${
              activeTab === "profile"
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon
              size={22}
              weight={activeTab === "profile" ? "fill" : "regular"}
            />
            <span>حساب</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

export const MobileAppExperience: Story = {
  render: () => <MobileAppExperienceView />,
};
