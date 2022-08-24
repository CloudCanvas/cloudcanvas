export interface DataFetcher<T, U> {
  delay: number;
  initialData: T;
  fetch: () => Promise<U>;
  reduce: (current: T, update: U) => T;
}
