import { makeAutoObservable, runInAction, toJS } from "mobx";
// @ts-ignore
import { v4 } from "uuid";
import { AwsComponent } from "cloudcanvas-types";
import { CANVAS_CENTER } from "../components/spatial/MainCanvasWrapper";
import { ConfigManager } from "cloudcanvas-configuration-manager";
import { Config } from "../domain/config";

type Update = {
  state: Partial<AwsComponent<any, any>["state"]>;
} & { id: string };
/**
 * As we move an element around the canvas it get's translated.
 * This means we should never re-update the component and re-render the x,y as if the translate persists we double jump.
 * So instead once retrieved from store we use the x and y only.
 * When updatiing the component we update the lastX and lastY.
 * Then when savng we place the lastX and lastY back into the x and y
 */
export class ComponentStore {
  components: AwsComponent<any, any>[] = [];
  copied?: AwsComponent<any, any>;

  locationToAdd?: [number, number] = undefined;

  constructor(private configManager: ConfigManager) {
    makeAutoObservable(this);

    this.init();
  }

  init = async () => {
    const config = await this.configManager.fetchConfig();

    if (config) {
      runInAction(() => (this.components = JSON.parse(config).components));
    }
  };

  addComponentFromModal = (component: AwsComponent<any, any>) => {
    const x = this.locationToAdd
      ? this.locationToAdd[0]
      : CANVAS_CENTER.x + 800;
    const y = this.locationToAdd
      ? this.locationToAdd[1]
      : CANVAS_CENTER.y + 100;

    const location = [x, y];

    this.addComponent({
      ...component,
      state: {
        ...component.state,
        layout: {
          ...component.state.layout,
          lastLocation: location,
          location,
        },
      },
    });
  };

  addComponent = (component: Omit<AwsComponent<any, any>, "id">) => {
    this.components.push({ ...component, id: v4() });

    this.saveComponents();
  };

  copySelectedComponent = () => {
    if (!this.selected) return;

    this.copied = this.selected;
  };

  pasteSelectedComponent = () => {
    if (!this.copied) return;

    this.components = [
      ...this.components,
      {
        ...this.copied,
        id: v4(),
        state: {
          ...this.copied.state,
          selected: false,
          playing: false,
          layout: {
            ...this.copied.state.layout,
            location: [
              this.copied.state.layout.location[0] +
                this.copied.state.layout.size[0] +
                50,
              this.copied.state.layout.location[1],
            ],
          },
        },
        // TODO Allow title to overriddens
        // title: `Copy of ${this.copied.title}`,
      },
    ];
  };

  deleteSelected = () => {
    if (!this.selected) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this component?"
    );

    if (!confirmed) return;

    this.components = this.components.filter((c) => c.id !== this.selected!.id);

    this.saveComponents();
  };

  updateComponent = (update: Update) => {
    const updated = this.components.map((c) => {
      if (c.id === update.id) {
        return {
          ...c,
          ...update,
          // Ensure we retain current X and Y as the drag component uses offsets
          // Only last location should be updated
          state: {
            ...c.state,
            ...update.state,
            layout: {
              ...c.state.layout,
              ...update.state!.layout,
              location: [...c.state.layout.location],
            },
          },
        };
      }
      return c;
    });

    this.components = [...updated];

    this.saveComponents();
  };

  updateAllComponents = (update: Omit<Update, "id">) => {
    for (const component of this.components) {
      this.updateComponent({
        ...update,
        id: component.id,
      });
    }
  };

  registerLocationToAdd = (location: [number, number]) => {
    this.locationToAdd = location;
  };

  clearLocationToAdd = () => {
    this.locationToAdd = undefined;
  };

  saveComponents = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const update = this.components.map((c) => ({
      ...c,
      state: {
        ...c.state,
        selected: false,
        layout: {
          ...c.state.layout,
          // Pop last location into location (we don't update location as translate manages it once the app is loaded)
          location: c.state.layout.lastLocation || c.state.layout.location,
        },
      },
    }));

    await this.configManager.saveConfig(
      JSON.stringify({
        components: update,
      })
    );
  };

  get selected() {
    return this.components.find((c) => c.state.selected);
  }
}
