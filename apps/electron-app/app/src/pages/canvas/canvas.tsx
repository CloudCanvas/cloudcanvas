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
import React from "react";
import ComponentKeyboardManager from "../../components/managers/ComponentKeyboardManager";
import MainCanvasWrapper from "../../components/spatial/MainCanvasWrapper";
import { useStores } from "../../store";

import "./canvas.css";

export default observer(() => {
  const { componentRenderer } = useStores();

  return (
    <MainCanvasWrapper>
      <ComponentKeyboardManager />
      {componentRenderer.wiredComponents.map((wiredComponent) => {
        return <ComponentWrapper definition={wiredComponent} />;
      })}
    </MainCanvasWrapper>
  );
});

const ComponentWrapper = observer(
  ({ definition }: { definition: BaseComponentProps<unknown, unknown> }) => {
    const { dynamoStreams } = useStores();

    switch (definition.state.component.def.type) {
      case "dynamoDbWatcher":
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
);
