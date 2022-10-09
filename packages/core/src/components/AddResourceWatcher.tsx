import React, { useEffect } from "react";
import { AddResource } from "@cloudcanvas/components";
import styled from "stitches.config";
import { Shape } from "shapes";

interface AddResourceProps {
  cancel: () => void;
  generatedShape?: Shape;
}

export default ({ cancel, generatedShape }: AddResourceProps) => {
  if (!generatedShape) {
    return null;
  }

  return (
    <Modal onClick={cancel}>
      <div
        className="add-resource-content-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 800, height: 500 }}
      >
        <AddResource
          organisations={[]}
          dataFetcher={async (aws) => {
            // const awsClient = aws.aws
            //   .account(accessCard.accountId)
            //   .region(accessCard.region)
            //   .role(accessCard.permissionSet);

            // return await component.customDataFetcher(awsClient, prefix);

            return [
              { label: "Label 1", value: "value 1" },
              { label: "Label 2", value: "value 2" },
              { label: "Label 3", value: "value 3" },
            ];
          }}
          onAddComponent={(resource: any) => {
            // component.addComponentFromModal(resource);
            // setVisible(false);
            // TODO Dispatch update cloud shape
            console.log(resource);
          }}
        />
      </div>
    </Modal>
  );
};

const Modal = styled("div", {
  position: "fixed",
  zIndex: 10000,
  top: "0",
  left: "0",
  height: "100%",
  width: "100%",
  background: "rgb(66 99 235 / 40%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
