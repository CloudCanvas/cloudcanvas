import { assign, createMachine } from "xstate";
import {
  AuthStatus,
  BaseComponentProps,
  DataFetcher,
} from "../components/layout/BaseComponent";

interface Context<T, U> {
  dataFetcher: DataFetcher<T, U>;
  data: T;
  playing: boolean;
  authorisation: AuthStatus;
}

interface Props<T, U> {
  dataFetcher: DataFetcher<T, U>;
  playing: boolean;
  authorisation: AuthStatus;
}

export const createStreamMachine = <T, U>(props: Props<T, U>) => {
  const initialContext: Context<T, U> = {
    dataFetcher: props.dataFetcher,
    data: props.dataFetcher.initialData,
    playing: props.playing,
    authorisation: props.authorisation,
  };

  /** @xstate-layout N4IgpgJg5mDOIC5SwC4CcwEMC2Y0DoBjDTFASwDsoBiCAewrH0oDc6BrJ1E3A4rclQSs6hUmQYBtAAwBdRKAAOdWGXIMFIAB6IAtAGZ9AVnzTpANnMAmI9KvmL0gIwAWADQgAnogCc+F04A7LbG+i6BgeFOAL7RHtxYvEQkgjR4aHQEigA2pABmmdj4CTh4yQKUUMIUbGLqFDLySCDKqvWaOgguLibSRj6BFoFODuEWHt4IRvr4ABz6Plazsz7dI876sfHoiWVkENlg1ABiAKIAKgDCABIA+gBKp5cA8vcAIgDKmq1qEhQdeishnwTmcrkCDkWVj6E0Q+nMTn8Lms5lmViCVgCri2IBKSX2h2oWlQpCYmDyKDwAApQWYAJTUPF7A5gb4qX4aZqdTGBEHIlw+aRhaSzaSBfSwhAzYZGcUWaZWQIrFyzHFMgh5MAoQgAC0qtAYTBEnGKO1KGq1usq1Vq4ikcjZbT+AIQulBM0xiqcPn0diM-UWksVszmTnh5n0s36VkVPjVZqSmu1eqo1HSmXwOXyhVNPDKSatQhEdT+jUdHP+XMQTicIZ8ovrtYFA36kpGvNB5hl0zM3WWsTiIAodAgcE06vK4io5faVddxhc+H60nry1RrjF5klboRS5r00Cgv0NlFLnjeYIBNZzR+s9AnV003wCOCy+60hVXa3XmroqXs0PVEIXmaFAnPXYLWTSoZ2dOcd2kEFZX9EUjBcdFZXcH8un6fB7EFcwjDRIwghcTZBwnfhSVONAMjQGDOXvQECL3VxFmcPoYyMSUIxDWsjFRf1DHhetwPNejK0Y+clSXQVV1mdcXE3bcgRmWx0VRBZzDQ-ijAHaIgA */
  return createMachine(
    {
      context: initialContext,
      tsTypes: {} as import("./dataFetcherMachine.typegen").Typegen0,
      schema: {
        context: {} as Context<T, U>,
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
          initial:
            props.authorisation === "authorized" ? "authorized" : "expired",
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
        addRecords: assign({
          data: (ctx, evt) => {
            if (!evt.data) {
              return ctx.data;
            }

            const update = ctx.dataFetcher.update(ctx.data, evt.data);
            return update;
          },
        }),
      },
      services: {
        fetchRecords: async (ctx) => {
          try {
            if (!ctx.playing || ctx.authorisation === "expired") {
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
