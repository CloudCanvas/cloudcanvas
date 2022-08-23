import { id } from "../../utils/generalUtils";
import { DynamoRecord } from "./model";

export const DynamoWatcherSampleData = [
  {
    id: id(),
    at: new Date(),
    type: "INSERT",
    key: {
      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
      ts: +new Date(),
    },
  } as DynamoRecord,
  {
    id: id(),
    at: new Date(),
    type: "MODIFY",
    key: {
      id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
      ts: +new Date(),
    },
  } as DynamoRecord,
];
