import { assign, createMachine, interpret } from "xstate";

// type EditorContext = {
//   items: any[];
//   past: any[];
//   future: any[];
// };

// type EditorEvents =
//   | { type: "TOGGLE_MODE"; index: number }
//   | { type: "ADD_SHAPE"; index: number; shape: any }
//   | { type: "DELETE_SHAPE"; index: number }
//   | { type: "UNDO" }
//   | { type: "REDO"; duration: number };

export const editorMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcD2AnAdAO2wFsBDAGwGIAVAeQHFaAZAUQH0BZagEScVAAcMsdCgx5eIAB6IAjAA5ZOeQHYArAGYVK2QCYl06WoA0IAJ6JtATgBsOJXrVW1a6doAsrpRYC+X46ky4BFgkFACCnJwsAMoAEqEACjxIIAJCaCJiyVIIrgoqnlYWFirSAAzWWtLGZgjSKhY4FrKq0laqshba8j5+EOjYOGgArlgARhhUdIysHNziqcKi4tlyCsrqmjp6BtXmubZFudqWBS4qPeB9AYMj4+ThkbEJSfyCi5mg2WquDVbaKqU-hZAaVSp5drUlNocM4ms5XM4ylZuhcCBA4OJ-AMlskFukcZ9EJpFADQVZpK4rCpXC5tFYIcDGhY1O0WRZKe4LljAkQyPM3viPpJEB4IV1So0ugY6lY2hTvL5Lv1cMMxhh+WkMstECyJaV8s1qblSv83GLmTg6aV3H81PJmVyrtgNe9tQhtEZTDIlEyin7-X61D4fEA */
  createMachine(
    {
      context: {
        // Keep track of the past
        past: [],

        // Our present
        items: [],

        // Keep track of the future
        future: [],
      },
      tsTypes: {} as import("./editorMachine.typegen").Typegen0,
      id: "editor",
      initial: "normal",
      on: {
        DELETE_SHAPE: {
          // Update the past when we delete a shape
          actions: ["updatePast", "deleteShape"],
        },
        UNDO: {
          actions: ["undo"],
        },
        REDO: {
          actions: ["redo"],
        },
      },
      states: {
        normal: {
          on: {
            TOGGLE_MODE: {
              target: "turbo",
            },
            ADD_SHAPE: {
              actions: ["updatePast", "addShape"],
            },
          },
        },
        turbo: {
          on: {
            TOGGLE_MODE: {
              target: "normal",
            },
            ADD_SHAPE: {
              actions: ["updatePast", "addThreeShapes"],
            },
          },
        },
      },
    },
    {
      actions: {
        addShape: assign({
          items: (ctx, e: any) => [...ctx.items, e.shape],
        }),
        addThreeShapes: assign({
          items: (ctx, e: any) => [...ctx.items, e.shape, e.shape, e.shape],
        }),
        deleteShape: assign({
          items: (ctx, e: any) => [
            ...ctx.items.slice(0, e.index),
            ...ctx.items.slice(e.index + 1),
          ],
        }),

        // # Handling Other Actions
        // @ts-ignore
        updatePast: assign({
          // 1. Insert the present at the end of the past.
          past: (ctx: EditorContext) => [...ctx.past, ctx.items] as any,

          // 2. Set the present to the new state after handling the action.
          // ! This happens in the 3 specific actions above

          // 3. Clear the future.
          future: [],
        }),

        // # Handling Undo
        undo: assign((ctx) => {
          const previous = ctx.past[ctx.past.length - 1];

          // 1. Remove the last element from the past.
          const newPast = ctx.past.slice(0, ctx.past.length - 1);
          return {
            past: newPast,

            // 2. Set the present to the element we removed in step 1.
            items: previous,

            // 3. Insert the old present state at the beginning of the future.
            future: [ctx.items, ...ctx.future],
          };
        }),

        // # Handling Redo
        redo: assign((ctx) => {
          const next = ctx.future[0];

          // 1. Remove the first element from the future.
          const newFuture = ctx.future.slice(1);
          return {
            // 2. Set the present to the element we removed in step 1.
            items: next,

            // 3. Insert the old present state at the end of the past.
            past: [...ctx.past, ctx.items],
            future: newFuture,
          };
        }),
      },
    }
  );
