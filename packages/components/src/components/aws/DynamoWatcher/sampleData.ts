import { id } from "../../../utils/generalUtils";
import { Model } from "./model";

export const SampleData = (): Model => {
  if (Math.random() > 0.5) {
    return [
      {
        id: id(),
        at: new Date(),
        type: "INSERT",
        key: {
          id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
          ts: +new Date(),
        },
      },
    ];
  } else {
    return [
      {
        id: id(),
        at: new Date(),
        type: "MODIFY",
        key: {
          id: "e0db8e08-e089-42a8-a11e-8dc0c42024ac",
          ts: +new Date(),
        },
      },
    ];
  }
};
