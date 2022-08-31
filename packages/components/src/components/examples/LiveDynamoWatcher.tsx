import React from "react";
import { BaseComponentProps } from "../layout/BaseComponent";
import { DynamoRecord, Model } from "../aws/DynamoWatcher/model";
import BaseComponent from "../layout/BaseComponent/BaseComponent";
import DynamoWatcher from "../aws/DynamoWatcher/View";
import { DataFetcher } from "../../ports/DataFetcher";
import { generateComponenEntry } from "../../domain";
import { DynamoWatcherCatalogComponent } from "../aws/DynamoWatcher/catalog";

export default () => {
  const [state, setState] = React.useState<BaseComponentProps["state"]>({
    component: generateComponenEntry({
      type: DynamoWatcherCatalogComponent.type,
      accessCard: {} as any,
      title: "Sample table",
      customData: {
        tableName: "TestTable",
      },
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
              state: {
                ...state.component.state,
                playing: !state.component.state.playing,
              },
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
              state: {
                ...state.component.state,
                selected: !state.component.state.selected,
              },
            },
          });
        },
      }}
      state={state}
    >
      <DynamoWatcher
        playing={state.component.state.playing}
        selected={state.component.state.selected}
        authorised={state.authorisation === "authorized"}
        awsClient={{} as any}
        customProps={{ label: "TestTableName", value: "TestTableName" }}
        dataFetcher={
          {
            delay: 1000,
            reduce: (data, update) => {
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
          } as DataFetcher<Model, Model>
        }
      />
    </BaseComponent>
  );
};
