import type { Preview } from "@storybook/react-vite";
import { DirectionProvider } from "@perpix/ui/components/direction-provider";
import "@perpix/ui/globals.css";
import "@perpix/ui/vazirmatn.css";
import "./preview.css";

/* iOS WebKit requires a touchstart listener on window for :active states to trigger reliably. */
if (typeof window !== "undefined") {
  window.addEventListener("touchstart", () => {}, { passive: true });
}

const customViewports = {
  iphone15: {
    name: "iPhone 15 / 16 (390px - PerPix Baseline)",
    styles: {
      width: "390px",
      height: "844px",
    },
    type: "mobile",
  },
  iphoneSE: {
    name: "iPhone SE (375px)",
    styles: {
      width: "375px",
      height: "667px",
    },
    type: "mobile",
  },
  ipadMini: {
    name: "iPad Mini (768px)",
    styles: {
      width: "768px",
      height: "1024px",
    },
    type: "tablet",
  },
};

const preview: Preview = {
  globalTypes: {
    theme: {
      toolbar: { title: "Theme", items: ["light", "dark"], dynamicTitle: true },
    },
    backdrop: {
      toolbar: {
        title: "Backdrop",
        items: [
          { value: "mesh", title: "Liquid Mesh", icon: "photo" },
          { value: "photo", title: "Canvas Grid", icon: "grid" },
          { value: "plain", title: "Plain Solid", icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      toolbar: {
        title: "Direction",
        items: ["rtl", "ltr"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", backdrop: "mesh", direction: "rtl" },
  parameters: {
    layout: "fullscreen",
    viewport: {
      viewports: customViewports,
    },
  },
  decorators: [
    (Story, { globals }) => {
      /* Theme and direction live on <html> (as in the apps) so portalled popups inherit them. */
      const root = document.documentElement;
      root.classList.toggle("dark", globals.theme === "dark");
      root.dir = globals.direction;
      root.lang = "fa";
      return (
        <DirectionProvider direction={globals.direction ?? "rtl"}>
          <main
            className="story-preview"
            data-backdrop={globals.backdrop ?? "mesh"}
          >
            <Story />
          </main>
        </DirectionProvider>
      );
    },
  ],
};

export default preview;
