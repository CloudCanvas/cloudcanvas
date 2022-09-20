export interface DataFetcher<M, U> {
  initialData: M;
  fetch: () => Promise<U>;
  reduce: (current: M, update: U | undefined) => M;
}
