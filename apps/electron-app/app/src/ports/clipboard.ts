export default interface Clipboard {
  writeText: (text: string) => Promise<void>;
}
