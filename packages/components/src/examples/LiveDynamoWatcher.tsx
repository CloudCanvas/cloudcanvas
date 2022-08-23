import React from "react";
import BaseComponent, {
  BaseComponentProps,
  DataFetcher,
} from "../components/layout/BaseComponent";
import DynamoWatcher, {
  DynamoWatcherComponent as DWC,
} from "../components/aws/DynamoWatcher";
import { DynamoRecord, DynamoWatcherModel } from "../components/aws/model";
import { AwsComponent, DynamoWatcherComponent } from "../domain";

export default () => {
  const [state, setState] = React.useState<
    BaseComponentProps<DynamoWatcherModel, DynamoWatcherModel>["state"]
  >({
    component: {
      def: DynamoWatcherComponent,
      id: Math.random() + "",
      playing: true,
      title: "Sample table",
      layout: {
        location: [0, 0],
        size: [700, 500],
        lastLocation: [0, 0],
      },
      config: {
        accountId: "123456789",
        region: "us-east-1",
        permissionSet: "AWSPowerUserAccess",
        ssoUrl: "https://myurl.com",
      },
      props: {
        tableName: "Users",
      },
    } as AwsComponent<DWC>,
    network: "connected",
    scale: 1,
    authorisation: "authorized",
  });

  return (
    <BaseComponent
      state={state}
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
      }}
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
      ContentComponent={DynamoWatcher}
    />
  );
};
