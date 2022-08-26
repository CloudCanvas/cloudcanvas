import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStores } from "../../store";
import { AddResource } from "@cloudcanvas/components";
import "./AddResourceWatcher.css";

export default observer(() => {
  const { aws, component, dynamo } = useStores();

  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel("app-data");
    channel.addEventListener("message", (event) => {
      setVisible(true);
      component.updateAllComponents({
        state: { selected: false },
      });

      component.registerLocationToAdd([
        event.data.location.actualLocationX,
        event.data.location.actualLocationY,
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
          organisations={aws.organisations}
          dataFetcher={async (component, accessCard) => {
            if (component.type === "dynamoDbWatcher") {
              const tables = await dynamo.fetchTables(accessCard);

              return tables.map((table) => ({
                label: table,
                value: table,
              }));
            } else if (component.type === "lambdaWatcher") {
              return [];
            } else {
              window.alert(
                "Ooops it seems like we don't know how to handle that resource yet."
              );
              return [];
            }
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
