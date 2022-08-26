import React from "react";
import { BaseComponentProps } from "../layout/BaseComponent";
import DynamoWatcher from "../aws/DynamoWatcher/view/DynamoWatcher";
import { DynamoRecord, DynamoWatcherModel } from "../aws/DynamoWatcher/model";
import BaseComponent from "../layout/BaseComponent/BaseComponent";
import MainCanvas, { CANVAS_CENTER } from "../spatial/MainCanvas/MainCanvas";
import { DataFetcher } from "../../ports/DataFetcher";
import { DynamoWatcherCatalogComponent } from "../aws/DynamoWatcher/model/catalog";
import { generateComponenEntry } from "../../domain";

export default () => {
  const [state, setState] = React.useState<BaseComponentProps["state"]>({
    component: generateComponenEntry({
      type: DynamoWatcherCatalogComponent.type,
      accessCard: {} as any,
      customData: {
        tableName: "TestTable",
      },
      location: [CANVAS_CENTER.x, CANVAS_CENTER.y],
    }),
    network: "connected",
    scale: 1,
    authorisation: "authorized",
  });

  return (
    <MainCanvas
      state={{}}
      dispatch={{
        onCmdk: async (cmdkProps) => {
          console.log(cmdkProps);
        },
        setScale: async (scale) => {
          console.log(scale);
        },
        setLocation: async (location) => {
          console.log(location);
        },
        unselectAllComponents: async () => {
          console.log("unselectAll");
        },
      }}
    >
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
          authorised={state.authorisation === "authorized"}
          awsClient={{} as any}
          customProps={{ tableName: "TestTableName" }}
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
            } as DataFetcher<DynamoWatcherModel, DynamoWatcherModel>
          }
        />
      </BaseComponent>
    </MainCanvas>
  );
};
