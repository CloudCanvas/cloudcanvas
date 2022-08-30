export interface DataFetcher<M, U> {
  delay: number;
  initialData: M;
  fetch: () => Promise<U>;
  reduce: (current: M, update: U) => M;
}
