import React from "react";
import { BaseComponentProps, DataFetcher } from "../layout/BaseComponent";
import DynamoWatcher from "../aws/DynamoWatcher";
import { DynamoRecord, DynamoWatcherModel } from "../aws/model";
import { DynamoWatcherComponentDef } from "../../domain";
import BaseComponent from "../layout/BaseComponent/BaseComponent";

export default () => {
  const [state, setState] = React.useState<
    BaseComponentProps<DynamoWatcherModel, DynamoWatcherModel>["state"]
  >({
    component: DynamoWatcherComponentDef.generateComponent({
      title: "Sample Watcher",
      config: {
        accountId: "1234567",
        region: "ap-southeast-2",
        permissionSet: "Admin",
      },
      customData: { label: "table", value: "Users" },
    }),
    network: "connected",
    scale: 1,
    authorisation: "authorized",
  });

  return (
    <BaseComponent
      dispatch={{
        onAuthorise: () => console.log("AUTHORISE"),
        onTogglePlay: () => {
          setState({
            ...state,
            component: {
              ...state.component,
              playing: !state.component.playing,
            },
          });
        },
        onResize: (size) => console.log(size),
        onMove: (location) => {
          console.log(location);
        },
        onSelection: () => {
          setState({
            ...state,
            component: {
              ...state.component,
              selected: !state.component.selected,
            },
          });
        },
      }}
      state={state}
      ContentComponent={DynamoWatcher}
      ports={{
        dataFetcher: {
          delay: 1000,
          update: (data, update) => {
            const updatedModel = [...data, ...update];
            return updatedModel;
          },
          initialData: [],
          fetch: async () => {
            return [
              {
                id: Math.random() + "",
                at: new Date(),
                type: "INSERT",
                key: {
                  id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
                  ts: +new Date(),
                },
              } as DynamoRecord,
            ];
          },
        } as DataFetcher<DynamoWatcherModel, DynamoWatcherModel>,
      }}
    />
  );
};
