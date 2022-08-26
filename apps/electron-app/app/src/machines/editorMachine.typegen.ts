// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  "internalEvents": {
    "xstate.init": { type: "xstate.init" };
  };
  "invokeSrcNameMap": {};
  "missingImplementations": {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  "eventsCausingActions": {
    addShape: "ADD_SHAPE";
    addThreeShapes: "ADD_SHAPE";
    deleteShape: "DELETE_SHAPE";
    redo: "REDO";
    undo: "UNDO";
    updatePast: "ADD_SHAPE" | "DELETE_SHAPE";
  };
  "eventsCausingServices": {};
  "eventsCausingGuards": {};
  "eventsCausingDelays": {};
  "matchesStates": "normal" | "turbo";
  "tags": never;
}
