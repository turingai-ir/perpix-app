import { useEffect } from "react";

const ILA_CHAT_WIDGET_SCRIPT_ID = "ILACHATWIDGETSCRIPT";

export function SupportChatProvider() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      return;
    }

    let script: HTMLScriptElement | null = null;

    const loadIlaChat = () => {
      if (!window.isIlaChatAdded) {
        window.isIlaChatAdded = true;
        script = document.createElement("script");
        script.id = ILA_CHAT_WIDGET_SCRIPT_ID;
        script.src = "https://widget.ila.chat/chat-widget.umd.js.gz";
        script.async = true;
        script.setAttribute(
          "data-bot-widget-token",
          "fq71AWvGvb7tuSJFOfcDcZKHZW9ATMF6",
        );
        document.body.appendChild(script);
      }
    };

    loadIlaChat();

    return () => {
      script?.remove();
      window.isIlaChatAdded = false;
    };
  }, []);

  return null;
}
