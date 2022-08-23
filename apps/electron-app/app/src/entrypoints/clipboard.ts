import Clipboard from "../ports/clipboard";

export const clipboard: Clipboard = (window as any).api.clipboard;
