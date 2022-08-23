import { makeAutoObservable } from "mobx";
import { AwsComponent } from "@cloudcanvas/components/lib/domain/core";
import { BaseComponentProps } from "@cloudcanvas/components/lib/components/layout/BaseComponent";
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
    component: AwsComponent<any>
  ): BaseComponentProps<unknown, unknown>["state"] => {
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
    component: AwsComponent<any>
  ): BaseComponentProps<unknown, unknown>["dispatch"] => {
    const org = this.awsStore.orgForUrl(component.config.ssoUrl);

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
          playing: !component.playing,
        });
      },
      onResize: (size) => {
        return this.componentStore.updateComponent({
          id: component.id,
          layout: {
            ...component.layout,
            size: size,
          },
        });
      },
      onMove: (location) => {
        return this.componentStore.updateComponent({
          id: component.id,
          layout: {
            ...component.layout,
            lastLocation: location,
          },
        });
      },
      onSelection: (selected) => {
        if (selected) {
          this.componentStore.updateAllComponents({
            selected: false,
          });
        }

        setTimeout(() => {
          this.componentStore.updateComponent({
            id: component.id,
            selected: selected,
          });
        }, 5);
      },
    };
  };

  get wiredComponents(): BaseComponentProps<unknown, unknown>[] {
    const components = this.componentStore.components as AwsComponent<any>[];

    const wiredComponents = components.map((component) => {
      return {
        dispatch: this.generateDispatch(component),
        state: this.generateState(component),
      } as BaseComponentProps<unknown, unknown>;
    });

    return wiredComponents;
  }
}
