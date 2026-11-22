import type { Preview } from "@storybook/react-vite";
import "@perpix/ui/globals.css";
import "@perpix/ui/vazirmatn.css";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      toolbar: { title: "Theme", items: ["light", "dark"], dynamicTitle: true },
    },
    direction: {
      toolbar: {
        title: "Direction",
        items: ["rtl", "ltr"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", direction: "rtl" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, { globals }) => (
      <main
        lang="fa"
        dir={globals.direction}
        className={globals.theme + " story-preview"}
      >
        <Story />
      </main>
    ),
  ],
};

export default preview;
