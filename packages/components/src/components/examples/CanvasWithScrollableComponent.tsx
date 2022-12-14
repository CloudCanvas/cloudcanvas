import { generateComponenEntry } from "../../domain";
import { DataFetcher } from "../../ports/DataFetcher";
import DynamoWatcher from "../aws/DynamoWatcher/View";
import { DynamoWatcherCatalogComponent } from "../aws/DynamoWatcher/catalog";
import { DynamoRecord, Model } from "../aws/DynamoWatcher/model";
import { BaseComponentProps } from "../layout/BaseComponent";
import BaseComponent from "../layout/BaseComponent/BaseComponent";
import MainCanvas, { CANVAS_CENTER } from "../spatial/MainCanvas/MainCanvas";
import { AwsRegion } from "cloudcanvas-types";
import React from "react";
import { v4 } from "uuid";

let count = 30;
export default () => {
  const [state, setState] = React.useState<BaseComponentProps["state"]>({
    component: generateComponenEntry({
      type: DynamoWatcherCatalogComponent.type,
      accessCard: {} as any,
      title: "TestTable",
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
          selected={state.component.state.selected}
          navigateTo={() => {}}
          setSelected={(isSelected) => {
            setState({
              ...state,
              component: {
                ...state.component,
                state: {
                  ...state.component.state,
                  selected: isSelected,
                },
              },
            });
          }}
          authorised={state.authorisation === "authorized"}
          awsClient={{} as any}
          access={{
            accountId: "",
            permissionSet: "",
            region: "ap-southeast-2" as AwsRegion,
          }}
          customProps={{ label: "TestTableName", value: "TestTableName" }}
          dataFetcher={
            {
              reduce: (data, update) => {
                const updatedModel = [...data, ...update!];
                return updatedModel;
              },
              initialData: [],
              fetch: async () => {
                count--;
                if (count <= 0) {
                  return [];
                }
                return [
                  {
                    id: Math.random() + "",
                    at: +new Date(),
                    dType: "INSERT",
                    key: {
                      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
                      ts: +new Date(),
                    },
                    message: JSON.stringify({
                      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
                      ts: +new Date(),
                    }),
                  } as DynamoRecord,
                  {
                    id: Math.random() + "",
                    at: +new Date(),
                    dType: "INSERT",
                    message: JSON.stringify({
                      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
                      ts: +new Date(),
                      a: v4(),
                      b: v4(),
                      c: v4(),
                      d: v4(),
                      e: v4(),
                    }),
                    key: {
                      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
                      ts: +new Date(),
                      a: v4(),
                      b: v4(),
                      c: v4(),
                      d: v4(),
                      e: v4(),
                    },
                  } as DynamoRecord,
                ];
              },
            } as DataFetcher<Model, Model>
          }
        />
      </BaseComponent>
    </MainCanvas>
  );
};
