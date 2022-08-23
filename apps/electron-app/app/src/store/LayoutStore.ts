import { makeAutoObservable, runInAction } from "mobx";
// @ts-ignore
import debounce from "debounce";

export class LayoutStore {
  scale: number = 0.85;
  // TODO
  location: number[] = [0, 0];

  constructor() {
    makeAutoObservable(this);
  }

  setScale = debounce((scale: number) => {
    runInAction(() => {
      this.scale = scale;
    });
  });
}
