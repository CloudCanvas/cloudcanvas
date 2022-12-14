// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.streamer.dataFetcher.fetching:invocation[0]": {
      type: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.streamer.dataFetcher.fetching:invocation[0]": {
      type: "error.platform.streamer.dataFetcher.fetching:invocation[0]";
      data: unknown;
    };
    "xstate.after(50)#streamer.offsetCounter.idle": {
      type: "xstate.after(50)#streamer.offsetCounter.idle";
    };
    "xstate.after(5000)#streamer.dataFetcher.idle": {
      type: "xstate.after(5000)#streamer.dataFetcher.idle";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchRecords: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    addRecords: "done.invoke.streamer.dataFetcher.fetching:invocation[0]";
    bumpError: "error.platform.streamer.dataFetcher.fetching:invocation[0]";
    checkIncrement: "";
  };
  eventsCausingServices: {
    fetchRecords:
      | "FETCH_RECORDS"
      | "xstate.after(5000)#streamer.dataFetcher.idle";
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
    | "offsetCounter"
    | "offsetCounter.idle"
    | "offsetCounter.maybeIncrement"
    | "playManager"
    | "playManager.paused"
    | "playManager.playing"
    | {
        authManager?: "authorized" | "expired";
        dataFetcher?: "fetching" | "idle";
        offsetCounter?: "idle" | "maybeIncrement";
        playManager?: "paused" | "playing";
      };
  tags: never;
}
