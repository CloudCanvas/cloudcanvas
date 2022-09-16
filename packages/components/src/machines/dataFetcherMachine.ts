import { assign, createMachine } from "xstate";
import {
  AuthStatus,
  BaseComponentProps,
} from "../components/layout/BaseComponent";
import { DataFetcher } from "../ports/DataFetcher";

interface Context<D, U> {
  dataFetcher: DataFetcher<D, U>;
  data: D;
  counter: number;
  playing: boolean;
  authorised: boolean;
  errorCount: number;
}

interface Props<D, U> {
  dataFetcher: DataFetcher<D, U>;
  playing: boolean;
  authorised: boolean;
}

export const createStreamMachine = <D, U>(props: Props<D, U>) => {
  const initialContext: Context<D, U> = {
    dataFetcher: props.dataFetcher,
    data: props.dataFetcher.initialData,
    playing: props.playing,
    authorised: props.authorised,
    counter: 0,
    errorCount: 0,
  };

  /** @xstate-layout N4IgpgJg5mDOIC5SwC4CcwEMC2Y0DoBjDTFASwDsoBiCAewrH0oDc6BrJ1E3A4rclQSs6hUmQYBtAAwBdRKAAOdWGXIMFIAB6IAtAGZ9AVnzTpANnMAmI9KvmL0gIwAWADQgAnogCc+F04A7LbG+i6BgeFOAL7RHtxYvEQkgjR4aHQEigA2pABmmdj4CTh4yQKUUMIUbGLqFDLySCDKqvWaOgguLibSRj6BFoFODuEWHt4IRvr4ABz6Plazsz7dI876sfHoiWVkENlg1ABiAKIAKgDCABIA+gBKp5cA8vcAIgDKmq1qEhQdeishnwTmcrkCDkWVj6E0Q+nMTn8Lms5lmViCVgCri2IBKSX2h2oWlQpCYmDyKDwAApQWYAJTUPF7A5gb4qX4aZqdTGBEHIlw+aRhaSzaSBfSwhAzYZGcUWaZWQIrFyzHFMgh5MAoQgAC0qtAYTBEnGKO1KGq1usq1Vq4ikcjZbT+AIQulBM0xiqcPn0diM-UWksVszmTnh5n0s36VkVPjVZqSmu1eqo1HSmXwOXyhVNPDKSatQhEdT+jUdHP+XMQTicIZ8ovrtYFA36kpGvNB5hl0zM3WWsTiIAodAgcE06vK4io5faVddxhc+H60nry1RrjF5klboRS5r00Cgv0NlFLnjeYIBNZzR+s9AnV003wCOCy+60hVXa3XmroqXs0PVEIXmaFAnPXYLWTSoZ2dOcd2kEFZX9EUjBcdFZXcH8un6fB7EFcwjDRIwghcTZBwnfhSVONAMjQGDOXvQECL3VxFmcPoYyMSUIxDWsjFRf1DHhetwPNejK0Y+clSXQVV1mdcXE3bcgRmWx0VRBZzDQ-ijAHaIgA */
  return createMachine(
    {
      context: initialContext,
      tsTypes: {} as import("./dataFetcherMachine.typegen").Typegen0,
      schema: {
        context: {} as Context<D, U>,
        events: {} as
          | { type: "FETCH_RECORDS" }
          | { type: "AUTHORISED" }
          | { type: "EXPIRED" }
          | { type: "PAUSED" }
          | { type: "PLAYING" }
          | { type: "PAUSED" },
        services: {} as {
          fetchRecords: {
            data: U | undefined;
          };
        },
      },
      type: "parallel",
      id: "streamer",
      states: {
        /**
         * This is a strange hack. We like data to animate in once at a time to this state basically loops and increments a counter every 10ms
         * and the counter is used to select the array of data to return i.e. counter = 4, data =[1,2,3,4,5,6,7], component should only render [1,2,3,4]
         */
        offsetCounter: {
          initial: "idle",
          states: {
            idle: {
              after: {
                "25": {
                  target: "maybeIncrement",
                },
              },
            },
            maybeIncrement: {
              always: {
                actions: ["checkIncrement"],
                target: "idle",
              },
            },
          },
        },
        dataFetcher: {
          initial: "idle",
          states: {
            idle: {
              after: {
                "1000": {
                  target: "fetching",
                },
              },
              on: {
                FETCH_RECORDS: {
                  target: "fetching",
                },
              },
            },
            fetching: {
              invoke: {
                src: "fetchRecords",
                onDone: [
                  {
                    actions: "addRecords",
                    target: "idle",
                  },
                ],
                onError: [
                  {
                    actions: "bumpError",
                    target: "idle",
                  },
                ],
              },
            },
          },
        },
        playManager: {
          initial: props.playing ? "playing" : "paused",
          //   initial: "playing",
          states: {
            playing: {
              // @ts-ignore
              on: {
                PAUSED: {
                  target: "paused",
                  actions: [
                    assign({
                      playing: (_ctx, _evt) => false,
                    }),
                  ],
                },
              },
            },
            paused: {
              // @ts-ignore
              on: {
                PLAYING: {
                  target: "playing",
                  actions: [
                    assign({
                      playing: (_ctx, _evt) => true,
                    }),
                  ],
                },
              },
            },
          },
        },
        authManager: {
          initial: props.authorised ? "authorized" : "expired",
          states: {
            authorized: {
              // @ts-ignore
              on: {
                EXPIRED: {
                  target: "expired",
                  actions: [
                    assign({
                      authorisation: (_ctx, _evt) => "expired" as AuthStatus,
                    }),
                  ],
                },
              },
            },
            expired: {
              // @ts-ignore
              on: {
                AUTHORISED: {
                  target: "authorized",
                  actions: [
                    assign({
                      authorisation: (_ctx, _evt) => "authorized" as AuthStatus,
                    }),
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        // TODO Figure out how to stagger the adds?
        addRecords: assign({
          data: (ctx, evt) => {
            if (!evt.data) {
              return ctx.data;
            }

            const update = ctx.dataFetcher.reduce(ctx.data, evt.data);
            return update;
          },
          errorCount: (_ctx, _evt) => {
            return 0;
          },
        }),
        bumpError: assign({
          errorCount: (ctx, evt) => {
            return ctx.errorCount + 1;
          },
        }),
        checkIncrement: assign({
          counter: (ctx, evt) => {
            if (!Array.isArray(ctx.data)) return ctx.counter;

            if (ctx.counter >= (ctx.data as any[]).length) {
              return ctx.counter;
            }

            return ctx.counter + 1;
          },
          errorCount: (_ctx, _evt) => {
            return 0;
          },
        }),
      },
      services: {
        fetchRecords: async (ctx) => {
          try {
            if (!ctx.playing || !ctx.authorised) {
              return undefined;
            }

            const update = await ctx.dataFetcher.fetch();

            return update;
          } catch (err) {
            console.log(err);
            return undefined;
          }
        },
      },
    }
  );
};
