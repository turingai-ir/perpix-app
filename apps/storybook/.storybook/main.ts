import type { StorybookConfig } from "@storybook/react-vite";
import { tmpdir } from "node:os";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.tsx"],
  viteFinal(config) {
    /* /home is eCryptfs (~143-char file names); Storybook 11 dep-cache names exceed it. */
    config.cacheDir = join(tmpdir(), "perpix-storybook-vite");
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/client",
        "lucide-react",
        "@perpix/ui > clsx",
        "@perpix/ui > tailwind-merge",
      ],
    };
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
