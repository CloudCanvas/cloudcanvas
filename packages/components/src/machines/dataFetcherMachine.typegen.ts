// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.streamer.dataFetcher.fetching:invocation[0]": {
      type: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.streamer.dataFetcher.fetching:invocation[0]": {
      type: "error.platform.streamer.dataFetcher.fetching:invocation[0]";
      data: unknown;
    };
    "xstate.after(1000)#streamer.dataFetcher.idle": {
      type: "xstate.after(1000)#streamer.dataFetcher.idle";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchRecords: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
  };
  missingImplementations: {
    actions: "bumpError";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    addRecords: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
    bumpError: "error.platform.streamer.dataFetcher.fetching:invocation[0]";
  };
  eventsCausingServices: {
    fetchRecords:
      | "FETCH_RECORDS"
      | "xstate.after(1000)#streamer.dataFetcher.idle";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "authManager"
    | "authManager.authorized"
    | "authManager.expired"
    | "dataFetcher"
    | "dataFetcher.fetching"
    | "dataFetcher.idle"
    | "playManager"
    | "playManager.paused"
    | "playManager.playing"
    | {
        authManager?: "authorized" | "expired";
        dataFetcher?: "fetching" | "idle";
        playManager?: "paused" | "playing";
      };
  tags: never;
}
