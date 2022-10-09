import type { Action } from "state/constants";

export const copy: Action = (data) => {
  const ID = `${data.page.id}-copied`;

  localStorage.setItem(ID, JSON.stringify(data));

  const copied = Object.values(data.page.shapes).filter((shape) =>
    data.pageState.selectedIds.includes(shape.id)
  );

  localStorage.setItem(ID, JSON.stringify(copied));
};
