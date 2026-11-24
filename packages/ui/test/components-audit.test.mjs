import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test, describe } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.resolve(__dirname, "../src/components");
const stylesDir = path.resolve(__dirname, "../src/styles");

const REQUIRED_COMPONENTS = [
  "avatar.tsx",
  "badge.tsx",
  "button.tsx",
  "checkbox.tsx",
  "dialog.tsx",
  "direction-provider.tsx",
  "dropdown-menu.tsx",
  "glass-surface.tsx",
  "input.tsx",
  "popover.tsx",
  "progress.tsx",
  "select.tsx",
  "sheet.tsx",
  "skeleton.tsx",
  "slider.tsx",
  "switch.tsx",
  "tabs.tsx",
  "toast.tsx",
  "tooltip.tsx",
];

describe("PerPix Component Audit - 6 Pillars", () => {
  // Pillar 1: Theme & Liquid Glass Tokens
  describe("Pillar 1: Dual-Theme Liquid Glass Fidelity", () => {
    const tokensCss = fs.readFileSync(
      path.join(stylesDir, "tokens.css"),
      "utf8",
    );
    const themeCss = fs.readFileSync(path.join(stylesDir, "theme.css"), "utf8");

    test("tokens.css defines soft glass highlights in dark mode", () => {
      assert.ok(
        tokensCss.includes(".dark"),
        "tokens.css must declare .dark section",
      );
      // Dark mode glass edge must be softened (<= 14%) to eliminate harsh wireframe border
      assert.ok(
        tokensCss.includes("--glass-edge-light: oklch(1 0 0 / 10%)") ||
          tokensCss.includes("--glass-edge-light: oklch(1 0 0 / 12%)") ||
          tokensCss.includes("--glass-edge-light: oklch(1 0 0 / 14%)"),
        "Dark mode --glass-edge-light must be softened to prevent wireframe borders",
      );
    });

    test("theme.css supports iOS 14-17 / Safari with -webkit-backdrop-filter", () => {
      assert.ok(
        themeCss.includes("-webkit-backdrop-filter"),
        "theme.css must declare -webkit-backdrop-filter alongside backdrop-filter",
      );
      assert.ok(
        themeCss.includes("(-webkit-backdrop-filter: blur(1px))"),
        "theme.css @supports must check for -webkit-backdrop-filter for iOS Safari compatibility",
      );
    });

    test("theme.css has fallbacks for reduced transparency and contrast", () => {
      assert.ok(
        themeCss.includes("prefers-reduced-transparency"),
        "theme.css must support prefers-reduced-transparency",
      );
      assert.ok(
        themeCss.includes("prefers-contrast: more"),
        "theme.css must support prefers-contrast: more",
      );
    });

    test("button, badge and toast do not use dark-ink foreground tokens on translucent glass", () => {
      for (const file of ["button.tsx", "badge.tsx", "toast.tsx"]) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          !content.includes("text-success-foreground") &&
            !content.includes("text-destructive-foreground"),
          `${file} must not use text-*-foreground on glass-tinted surfaces (causes black text in dark mode)`,
        );
      }
    });
  });

  // Pillar 2: Multi-Device & Mobile-First
  describe("Pillar 2: Multi-Device & Mobile-First Baseline", () => {
    test("all interactive controls define pointer-coarse hit target sizing (>= 44px)", () => {
      const coarseChecks = [
        {
          file: "button.tsx",
          pattern: /pointer-coarse:(h-11|min-h-11|size-11)/,
        },
        { file: "input.tsx", pattern: /pointer-coarse:(h-11|min-h-11)/ },
        { file: "select.tsx", pattern: /pointer-coarse:(h-11|min-h-11)/ },
        { file: "checkbox.tsx", pattern: /pointer-coarse:size-6/ },
        { file: "switch.tsx", pattern: /pointer-coarse:(h-7|size-6)/ },
        { file: "slider.tsx", pattern: /pointer-coarse:(size-7|h-2\.5)/ },
        { file: "tabs.tsx", pattern: /pointer-coarse:(h-12|min-h-11)/ },
        { file: "sheet.tsx", pattern: /pointer-coarse:min-h-11/ },
      ];

      for (const { file, pattern } of coarseChecks) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          pattern.test(content),
          `${file} must specify pointer-coarse sizing for mobile touch targets >= 44px`,
        );
      }
    });

    test("sheet and dialog overlays declare overscroll-contain", () => {
      for (const file of ["dialog.tsx", "sheet.tsx", "select.tsx"]) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          content.includes("overscroll-contain"),
          `${file} must declare overscroll-contain to prevent modal scroll-chaining`,
        );
      }
    });
  });

  // Pillar 3: Native Feel & Tactility
  describe("Pillar 3: Native Mobile Feel & Tactility", () => {
    test("tactile controls invoke haptic feedback", () => {
      for (const file of [
        "button.tsx",
        "switch.tsx",
        "slider.tsx",
        "checkbox.tsx",
        "tabs.tsx",
      ]) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          content.includes("triggerHaptic"),
          `${file} must integrate triggerHaptic for native tactile feedback`,
        );
      }
    });

    test("scrollable tabs disable CSS snap during active mouse dragging (snap-none)", () => {
      const tabsContent = fs.readFileSync(
        path.join(componentsDir, "tabs.tsx"),
        "utf8",
      );
      assert.ok(
        tabsContent.includes("snap-none"),
        "tabs.tsx must set snap-none during active dragging to eliminate stutter",
      );
    });

    test("scrollable tabs include frosted edge fade masks and nav arrows", () => {
      const tabsContent = fs.readFileSync(
        path.join(componentsDir, "tabs.tsx"),
        "utf8",
      );
      assert.ok(
        tabsContent.includes("getMaskImage") &&
          tabsContent.includes("showArrows"),
        "tabs.tsx must provide edge dissolution mask and floating navigation arrows",
      );
    });
  });

  // Pillar 4: Universal RTL & Bidirectional Compatibility
  describe("Pillar 4: Universal RTL & Bidirectional Compatibility", () => {
    test("no forbidden physical spacing classes (pl-, pr-, ml-, mr-) in component files", () => {
      const forbiddenPhysical = /\b(pl-\d|pr-\d|ml-\d|mr-\d)\b/;

      for (const file of REQUIRED_COMPONENTS) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        const match = forbiddenPhysical.exec(content);
        assert.strictEqual(
          match,
          null,
          `Found forbidden physical property ${match?.[0]} in ${file}. Use ps-, pe-, ms-, me- instead.`,
        );
      }
    });

    test("useDragScroll implements cross-browser RTL scroll normalization", () => {
      const hookContent = fs.readFileSync(
        path.resolve(__dirname, "../src/hooks/use-drag-scroll.ts"),
        "utf8",
      );
      assert.ok(
        hookContent.includes("getRtlScrollType"),
        "useDragScroll must normalize RTL scroll types across Chromium, WebKit, and Gecko",
      );
      assert.ok(
        hookContent.includes("distFromStart") &&
          hookContent.includes("distFromEnd"),
        "useDragScroll must compute normalized start and end distances in RTL",
      );
    });

    test("tabs arrow icons rotate 180 degrees in RTL", () => {
      const tabsContent = fs.readFileSync(
        path.join(componentsDir, "tabs.tsx"),
        "utf8",
      );
      assert.ok(
        tabsContent.includes("rtl:rotate-180"),
        "Tabs arrow buttons must include rtl:rotate-180 to point toward their logical destination",
      );
    });
  });

  // Pillar 5: Accessibility & WCAG 2.2 Standards
  describe("Pillar 5: Accessibility & WCAG 2.2 Standards", () => {
    test("interactive inputs and triggers declare focus-ring", () => {
      for (const file of [
        "button.tsx",
        "input.tsx",
        "select.tsx",
        "checkbox.tsx",
        "switch.tsx",
        "tabs.tsx",
      ]) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          content.includes("focus-ring"),
          `${file} must provide visible focus indicators with focus-ring`,
        );
      }
    });

    test("icons are marked aria-hidden", () => {
      for (const file of [
        "input.tsx",
        "select.tsx",
        "dialog.tsx",
        "sheet.tsx",
      ]) {
        const content = fs.readFileSync(path.join(componentsDir, file), "utf8");
        assert.ok(
          content.includes("aria-hidden"),
          `${file} must mark decorative icons as aria-hidden`,
        );
      }
    });
  });

  // Pillar 6: State Completeness & Edge Cases
  describe("Pillar 6: State Completeness & Edge Cases", () => {
    test("Dialog and Sheet provide dedicated scrollable Body components", () => {
      const dialogContent = fs.readFileSync(
        path.join(componentsDir, "dialog.tsx"),
        "utf8",
      );
      const sheetContent = fs.readFileSync(
        path.join(componentsDir, "sheet.tsx"),
        "utf8",
      );

      assert.ok(
        dialogContent.includes("DialogBody"),
        "dialog.tsx must export DialogBody for long content with pinned header/footer",
      );
      assert.ok(
        sheetContent.includes("SheetBody"),
        "sheet.tsx must export SheetBody for long bottom-sheet content",
      );
    });

    test("Input supports startIcon, endIcon, clearable, and error states", () => {
      const inputContent = fs.readFileSync(
        path.join(componentsDir, "input.tsx"),
        "utf8",
      );
      assert.ok(
        inputContent.includes("startIcon"),
        "input.tsx must support startIcon",
      );
      assert.ok(
        inputContent.includes("endIcon"),
        "input.tsx must support endIcon",
      );
      assert.ok(
        inputContent.includes("clearable"),
        "input.tsx must support clearable",
      );
      assert.ok(
        inputContent.includes("error"),
        "input.tsx must support error state",
      );
    });

    test("Toast supports stacked deck collapse behavior", () => {
      const toastContent = fs.readFileSync(
        path.join(componentsDir, "toast.tsx"),
        "utf8",
      );
      assert.ok(
        toastContent.includes("stacked") &&
          toastContent.includes("--toast-index"),
        "toast.tsx must support stacked deck mode to prevent vertical screen overflow",
      );
      assert.ok(
        toastContent.includes("ToastProgress") &&
          toastContent.includes("toast-countdown"),
        "toast.tsx must export ToastProgress for auto-remove visual countdown",
      );
      assert.ok(
        toastContent.includes("Toaster") &&
          toastContent.includes("globalToastManager"),
        "toast.tsx must export Toaster and globalToastManager for imperative toast calls",
      );
    });

    test("Input supports startIcon, endIcon, clearable, passwordToggle, and helperText", () => {
      const inputContent = fs.readFileSync(
        path.join(componentsDir, "input.tsx"),
        "utf8",
      );
      assert.ok(
        inputContent.includes("startIcon"),
        "input.tsx must support startIcon",
      );
      assert.ok(
        inputContent.includes("endIcon"),
        "input.tsx must support endIcon",
      );
      assert.ok(
        inputContent.includes("clearable"),
        "input.tsx must support clearable",
      );
      assert.ok(
        inputContent.includes("showPasswordToggle"),
        "input.tsx must support showPasswordToggle",
      );
      assert.ok(
        inputContent.includes("helperText"),
        "input.tsx must support helperText",
      );
    });

    test("Button supports loadingText", () => {
      const buttonContent = fs.readFileSync(
        path.join(componentsDir, "button.tsx"),
        "utf8",
      );
      assert.ok(
        buttonContent.includes("loadingText"),
        "button.tsx must support loadingText for status during busy operations",
      );
    });

    test("Checkbox supports tri-state indeterminate mode", () => {
      const checkboxContent = fs.readFileSync(
        path.join(componentsDir, "checkbox.tsx"),
        "utf8",
      );
      assert.ok(
        checkboxContent.includes("MinusIcon") &&
          checkboxContent.includes("data-indeterminate"),
        "checkbox.tsx must support indeterminate tri-state with MinusIcon",
      );
    });

    test("Badge supports status dots, removable chips, and localized count overflow", () => {
      const badgeContent = fs.readFileSync(
        path.join(componentsDir, "badge.tsx"),
        "utf8",
      );
      assert.ok(
        badgeContent.includes("dot") && badgeContent.includes("removable"),
        "badge.tsx must support dot status indicators and removable chip tags",
      );
      assert.ok(
        badgeContent.includes("formatBadgeCount") &&
          badgeContent.includes("overflowCount"),
        "badge.tsx must support localized numeric counts with overflowCount",
      );
    });

    test("Avatar supports size variants, status badges, AvatarGroup, and autoInitials", () => {
      const avatarContent = fs.readFileSync(
        path.join(componentsDir, "avatar.tsx"),
        "utf8",
      );
      assert.ok(
        avatarContent.includes("status"),
        "avatar.tsx must support status indicator",
      );
      assert.ok(
        avatarContent.includes("AvatarGroup"),
        "avatar.tsx must export AvatarGroup",
      );
      assert.ok(
        avatarContent.includes("getInitials"),
        "avatar.tsx must export getInitials for name prop",
      );
    });

    test("Progress supports determinate and indeterminate states, variants, and localized value", () => {
      const progressContent = fs.readFileSync(
        path.join(componentsDir, "progress.tsx"),
        "utf8",
      );
      assert.ok(
        progressContent.includes("ProgressTrack"),
        "progress.tsx must export ProgressTrack",
      );
      assert.ok(
        progressContent.includes("ProgressIndicator"),
        "progress.tsx must export ProgressIndicator",
      );
      assert.ok(
        progressContent.includes("ProgressValue"),
        "progress.tsx must export ProgressValue",
      );
      assert.ok(
        progressContent.includes("ProgressLabel"),
        "progress.tsx must export ProgressLabel",
      );
      assert.ok(
        progressContent.includes("progressVariants"),
        "progress.tsx must declare progressVariants",
      );
      assert.ok(
        progressContent.includes("indeterminate"),
        "progress.tsx must support indeterminate state",
      );
      assert.ok(
        progressContent.includes('data-slot="progress"'),
        "progress.tsx must declare data-slot='progress'",
      );
    });

    test("Skeleton supports shapes, shimmer animation, and compound text/card presets", () => {
      const skeletonContent = fs.readFileSync(
        path.join(componentsDir, "skeleton.tsx"),
        "utf8",
      );
      assert.ok(
        skeletonContent.includes("skeletonVariants"),
        "skeleton.tsx must declare skeletonVariants",
      );
      assert.ok(
        skeletonContent.includes("SkeletonText"),
        "skeleton.tsx must export SkeletonText for multi-line loading",
      );
      assert.ok(
        skeletonContent.includes("shimmer"),
        "skeleton.tsx must support shimmer animation",
      );
      assert.ok(
        skeletonContent.includes('data-slot="skeleton"'),
        "skeleton.tsx must declare data-slot='skeleton'",
      );
    });
  });
});
