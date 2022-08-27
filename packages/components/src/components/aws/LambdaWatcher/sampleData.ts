import { id } from "../../../utils/generalUtils";
import { Model } from "./model";

export const SampleData = (): Model => {
  if (Math.random() > 0.5) {
    return ["Log entry 1"];
  } else {
    return ["Log entry more"];
  }
};
