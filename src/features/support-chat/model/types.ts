export interface IlaChatWidgetApi {
  openWidget: () => void;
  closeWidget?: () => void;
}

declare global {
  interface Window {
    ILACHAT?: IlaChatWidgetApi;
    isIlaChatAdded?: boolean;
  }
}

export interface UseSupportChatWidgetResult {
  openChatWidget: () => void;
}
