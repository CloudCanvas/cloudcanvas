export interface Browser {
  open: (path: string) => Promise<void>;
}
