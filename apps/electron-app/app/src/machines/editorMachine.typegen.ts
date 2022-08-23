// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  "eventsCausingActions": {
    updatePast: "DELETE_SHAPE" | "ADD_SHAPE";
    deleteShape: "DELETE_SHAPE";
    undo: "UNDO";
    redo: "REDO";
    addShape: "ADD_SHAPE";
    addThreeShapes: "ADD_SHAPE";
  };
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
  "eventsCausingServices": {};
  "eventsCausingGuards": {};
  "eventsCausingDelays": {};
  "matchesStates": "normal" | "turbo";
  "tags": never;
}
