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
    (Story, { globals }) => {
      /* Theme and direction live on <html> (as in the apps) so portalled popups inherit them. */
      const root = document.documentElement;
      root.classList.toggle("dark", globals.theme === "dark");
      root.dir = globals.direction;
      root.lang = "fa";
      return (
        <main className="story-preview">
          <Story />
        </main>
      );
    },
  ],
};

export default preview;
