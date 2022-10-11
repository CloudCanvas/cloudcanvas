import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStores } from "../../store";
import { AddResource } from "cloudcanvas-components";
import "./AddResourceWatcher.css";
import { aws } from "../../entrypoints/aws";

export default observer(() => {
  const { aws: awsStore, component } = useStores();

  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel("app-data");
    channel.addEventListener("message", (event) => {
      setVisible(true);
      component.updateAllComponents({
        state: { selected: false },
      });

      component.registerLocationToAdd([
        event.data.location.actualLocationX + 100,
        event.data.location.actualLocationY + 100,
      ]);
    });
  }, []);

  const onClose = () => {
    setVisible(false);
    component.clearLocationToAdd();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="add-resource-modal" onClick={onClose}>
      <div
        className="add-resource-content-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 800, height: 500 }}>
        <AddResource
          organisations={awsStore.organisations}
          dataFetcher={async (component, accessCard, prefix) => {
            component.defaultSize;
            // Okay where do I get the AWS config for the actual data fetchiunfg dynamically?
            const awsClient = aws.aws
              .account(accessCard.accountId)
              .region(accessCard.region)
              .role(accessCard.permissionSet);

            return await component.customDataFetcher(awsClient, prefix);
          }}
          onAddComponent={(resource) => {
            component.addComponentFromModal(resource);
            setVisible(false);
          }}
        />
      </div>
    </div>
  );
});
