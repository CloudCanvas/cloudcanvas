import { observer } from "mobx-react-lite";
import React from "react";
import { Modal } from "@cloudscape-design/components";

type Props = {
  children: JSX.Element;
  header: string;
  onDismiss: () => void;
};
export default observer((props: Props) => {
  return (
    <Modal
      visible={true}
      closeAriaLabel="Close modal"
      header={props.header}
      onDismiss={props.onDismiss}>
      {props.children}

      <div style={{ height: 8 }}></div>
    </Modal>
  );
});
