import React from "react";
import DynamoWatcher, { ViewProps } from "./View";
import { DynamoRecord } from "./model";
import { id } from "../../../utils/generalUtils";
import "bulma/css/bulma.css";

export default {
  title: "components/aws/DynamoWatcher",
  component: DynamoWatcher,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: ViewProps) => () =>
  (
    <div
      style={{
        width: 600,
        height: 400,
        borderRadius: 3,
        borderWidth: 3,
        borderStyle: "solid",
      }}
    >
      <DynamoWatcher {...args} />
    </div>
  );

// Reuse that template for creating different stories
export const NoRecords = Template({
  data: [],
  selected: false,
});

export const RecordsKeyOnly = Template({
  data: [
    {
      id: id(),
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
      id: id(),
      at: +new Date(),
      dType: "MODIFY",
      key: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      },
      message: JSON.stringify({
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      }),
    } as DynamoRecord,
  ],
  selected: false,
});

export const RecordsNewImage = Template({
  data: [
    {
      id: id(),
      at: +new Date(),
      dType: "INSERT",
      key: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      },
      newImage: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "test abc",
        value2: "test def",
      },
      message: JSON.stringify({
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "test abc",
        value2: "test def",
      }),
    } as DynamoRecord,
    {
      id: id(),
      at: +new Date(),
      dType: "MODIFY",
      key: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      },
      newImage: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "12345",
        value2: "678910",
      },
      message: JSON.stringify({
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "12345",
        value2: "678910",
      }),
    } as DynamoRecord,
  ],
  selected: false,
});

export const RecordsNewAndOldImage = Template({
  data: [
    {
      id: id(),
      at: +new Date(),
      dType: "INSERT",
      key: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      },
      newImage: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "test abc",
        value2: "test def",
      },
      message: JSON.stringify({
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "test abc",
        value2: "test def",
      }),
    } as DynamoRecord,
    {
      id: id(),
      at: +new Date(),
      dType: "MODIFY",
      key: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
      },
      newImage: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "12345",
        value2: "678910",
      },
      oldImage: {
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "12345",
      },
      message: JSON.stringify({
        id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
        ts: +new Date(),
        value1: "12345",
        value2: "678910",
      }),
    } as DynamoRecord,
  ],
  selected: false,
});

const lotsOfRecords: DynamoRecord[] = [];
for (let i = 0; i < 100; i++) {
  lotsOfRecords.push({
    id: id(),
    at: +new Date(),
    dType: "INSERT",
    key: {
      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
      ts: +new Date(),
    },
    newImage: {
      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
      ts: +new Date(),
      value1: "test abc",
      value2: "test def",
    },
    message: JSON.stringify({
      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
      ts: +new Date(),
      value1: "test abc",
      value2: "test def",
    }),
  } as DynamoRecord);
}

export const LotsOfRecords = Template({
  data: lotsOfRecords,
  selected: false,
});
