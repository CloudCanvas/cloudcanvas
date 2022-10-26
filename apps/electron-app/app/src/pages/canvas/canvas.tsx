import ComponentKeyboardManager from "../../components/managers/ComponentKeyboardManager";
import MainCanvasWrapper from "../../components/spatial/MainCanvasWrapper";
import { aws, ssoBridge } from "../../entrypoints/aws";
import { difference } from "../../lib/diff";
import { useStores } from "../../store";
import "./canvas.css";
import { BaseComponent } from "cloudcanvas-components";
import * as Components from "cloudcanvas-components";
import { DynamoWatcherModel } from "cloudcanvas-components/lib/components/aws/DynamoWatcher/model";
import { DynamoWatcherCustomProps } from "cloudcanvas-components/lib/components/aws/DynamoWatcher/view/DynamoWatcher";
import { BaseComponentProps } from "cloudcanvas-components/lib/components/layout/BaseComponent";
import { AwsComponent } from "cloudcanvas-types";
import isEqual from "lodash.isequal";
import { observer } from "mobx-react-lite";
import React, { memo } from "react";

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
  observer(({ definition }: { definition: BaseComponentProps }) => {
    const c = definition.state.component as AwsComponent<
      DynamoWatcherModel,
      DynamoWatcherCustomProps
    >;

    const catalog = Components.Core.componentCatalog.find(
      (cc) => cc.type === c.type
    )!;

    return (
      <BaseComponent {...definition}>
        {catalog.component({
          authorised: definition.state.authorisation === "authorized",
          playing: c.state.playing,
          selected: c.state.selected,
          setSelected: () => {},
          navigateTo: (url) => {
            ssoBridge.navigateTo(
              url,
              c.config.accountId,
              c.config.permissionSet
            );
          },
          access: c.config,
          awsClient: aws.aws
            .account(c.config.accountId)
            .region(c.config.region)
            .role(c.config.permissionSet),
          customProps: c.props,
        })}
      </BaseComponent>
    );
  }),
  // Rerendering only when the state has changed.s
  (prevProps, nextProps) => {
    const diff = difference(
      prevProps.definition.state,
      nextProps.definition.state
    );

    if (Object.keys(diff).length > 0) {
      // // TODO Don't re-render on zoom change
      // console.log(
      //   `Rerendering ${nextProps.definition.state.component.id} as state has changed;`
      // );
      // console.log(diff);
    }

    const equal = isEqual(
      prevProps.definition.state,
      nextProps.definition.state
    );
    return equal;
  }
);
