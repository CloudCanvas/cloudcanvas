import { makeAutoObservable, runInAction } from "mobx";
// @ts-ignore
import debounce from "debounce";

export class LayoutStore {
  scale: number = 1;
  // TODO
  location: number[] = [0, 0];

  constructor() {
    makeAutoObservable(this);

    // window.localStorage.removeItem("layout");

    const layout = JSON.parse(window.localStorage.getItem("layout") || "[]");

    if (!layout) return;

    this.location = layout.location;
  }

  setScale = debounce((scale: number) => {
    runInAction(() => {
      this.scale = scale;
    });
  });

  setLocation = debounce((location: number[]) => {
    runInAction(() => {
      this.location = location;
      this.saveLayout();
    });
  });

  saveLayout = () => {
    window.localStorage.setItem(
      "layout",
      JSON.stringify({
        location: this.location,
      })
    );
  };
}
