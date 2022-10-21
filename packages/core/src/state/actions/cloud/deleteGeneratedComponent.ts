import type { Action } from "state/constants";
import { mutables } from "state/mutables";

export const deleteGeneratedComponent: Action = (data) => {
  const { page } = data;
  const generated = Object.values(page.shapes).filter((s) => s.isGenerated);

  generated.forEach((g) => delete page.shapes[g.id]);

  mutables.history.push(data);
};
