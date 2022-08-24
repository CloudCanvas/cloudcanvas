import { AwsRegion } from "@cloudcanvas/aws-sso-api";
import { BaseComponent, DynamoWatcher } from "@cloudcanvas/components";
import { DynamoWatcherComponent } from "@cloudcanvas/components/lib/components/aws/DynamoWatcher";
import { DynamoWatcherModel } from "@cloudcanvas/components/lib/components/aws/model";
import {
  BaseComponentProps,
  DataFetcher,
} from "@cloudcanvas/components/lib/components/layout/BaseComponent";
import { AwsComponent } from "@cloudcanvas/components/lib/domain";
import { observer } from "mobx-react-lite";
import React, { memo } from "react";
import ComponentKeyboardManager from "../../components/managers/ComponentKeyboardManager";
import MainCanvasWrapper from "../../components/spatial/MainCanvasWrapper";
import { useStores } from "../../store";
import isEqual from "lodash.isequal";

import "./canvas.css";
import { difference } from "../../lib/diff";

export default observer(() => {
  const { componentRenderer } = useStores();

  return (
    <MainCanvasWrapper>
      <ComponentKeyboardManager />
      {componentRenderer.wiredComponents.map((wiredComponent) => {
        return (
          <ComponentWrapper
            definition={wiredComponent}
            key={wiredComponent.state.component.id}
          />
        );
      })}
    </MainCanvasWrapper>
  );
});

const ComponentWrapper = memo(
  observer(
    ({ definition }: { definition: BaseComponentProps<unknown, unknown> }) => {
      const { dynamoStreams } = useStores();

      switch (definition.state.component.def.type) {
        case "dynamoDbWatcher":
          // console.log("rerrendering base component");
          const c = definition.state
            .component as AwsComponent<DynamoWatcherComponent>;

          return (
            <BaseComponent
              {...definition}
              ContentComponent={DynamoWatcher}
              ports={{
                dataFetcher: {
                  initialData: [],
                  delay: 1000,
                  fetch: async () => {
                    const records = await dynamoStreams.fetchRecords({
                      accountId: c.config.accountId!,
                      permissionSet: c.config.permissionSet!,
                      region: c.config.region! as AwsRegion,
                      tableName: c.props.tableName,
                    });

                    return records;
                  },
                  update: (current, update) => {
                    const next = [...current, ...update];
                    console.log(
                      `Received ${next.length} records for ${c.props.tableName}`
                    );
                    return next;
                  },
                } as DataFetcher<DynamoWatcherModel, DynamoWatcherModel>,
              }}
            />
          );
        case "lambdaWatcher":
          return (
            <div
              style={{
                width: 350,
                height: 600,
                position: "absolute",
                left: 450 + 30,
                top: 50,
                background: "black",
              }}
            />
          );

        default:
          return (
            <div
              style={{
                width: 350,
                height: 600,
                position: "absolute",
                left: 450 + 30,
                top: 50,
                background: "black",
                zIndex: 909999,
              }}
            />
          );
      }
    }
  ),
  (prevProps, nextProps) => {
    const diff = difference(
      prevProps.definition.state,
      nextProps.definition.state
    );

    if (Object.keys(diff).length > 0) {
      console.log(
        `Rerendering ${nextProps.definition.state.component.id} as state has changed;`
      );
      console.log(diff);
    }

    const equal = isEqual(
      prevProps.definition.state,
      nextProps.definition.state
    );
    return equal;
  }
);
