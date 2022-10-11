import { makeAutoObservable, toJS } from "mobx";
import * as Component from "cloudcanvas-components";
import { AwsComponent } from "cloudcanvas-types";
import { BaseComponentProps } from "cloudcanvas-components/lib/components/layout/BaseComponent";
import { AwsStore } from "./AwsStore";
import { ComponentStore } from "./ComponentStore";
import { LayoutStore } from "./LayoutStore";

// Blends together AWS informaton and components into a unified view.
export class ComponentRendererStore {
  constructor(
    private awsStore: AwsStore,
    private componentStore: ComponentStore,
    private layoutStore: LayoutStore
  ) {
    makeAutoObservable(this);
  }

  generateState = (
    component: AwsComponent<any, any>
  ): BaseComponentProps["state"] => {
    const org = this.awsStore.orgForAcc(component.config.accountId);
    return {
      component,
      scale: this.layoutStore.scale,
      authorisation:
        org?.authorisedUntil && +new Date(org?.authorisedUntil) > +new Date()
          ? "authorized"
          : "expired",
    };
  };

  generateDispatch = (
    component: AwsComponent<any, any>
  ): BaseComponentProps["dispatch"] => {
    const org = this.awsStore.orgForAcc(component.config.accountId);

    return {
      onAuthorise: () => {
        if (!org) {
          window.alert("Authorisation not available, please restart");
          return;
        }

        this.awsStore.authoriseOrg(org);
      },
      onTogglePlay: () => {
        return this.componentStore.updateComponent({
          id: component.id,
          state: {
            playing: !component.state.playing,
          },
        });
      },
      onResize: (size) => {
        if (
          size[0] === component.state.layout.size[0] &&
          size[1] === component.state.layout.size[1]
        ) {
          return;
        }

        return this.componentStore.updateComponent({
          id: component.id,
          state: {
            layout: {
              ...component.state.layout,
              size: size,
            },
          },
        });
      },
      onMove: (location) => {
        if (
          location[0] === component.state.layout.location[0] &&
          location[1] === component.state.layout.location[1]
        ) {
          return;
        }

        return this.componentStore.updateComponent({
          id: component.id,
          state: {
            layout: {
              ...component.state.layout,
              lastLocation: location,
            },
          },
        });
      },
      onSelection: (selected) => {
        if (selected === component.state.selected) {
          return;
        }

        if (selected) {
          this.componentStore.updateAllComponents({
            state: { selected: false },
          });
        }

        setTimeout(() => {
          this.componentStore.updateComponent({
            id: component.id,
            state: { selected: selected },
          });
        }, 5);
      },
    };
  };

  get wiredComponents(): BaseComponentProps[] {
    const components = this.componentStore
      .components as Component.Core.AwsComponent<unknown, unknown>[];

    const wiredComponents = components.map((component) => {
      return {
        dispatch: this.generateDispatch(component),
        state: this.generateState(component),
      } as BaseComponentProps;
    });

    return wiredComponents;
  }
}
