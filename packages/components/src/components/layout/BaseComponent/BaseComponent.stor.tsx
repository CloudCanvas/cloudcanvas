import React from "react";
import BaseComponent, { BaseComponentProps } from "./BaseComponent";
import { BaseStory, dcpZeroed } from "../../../utils/storyUtils";
import { AwsComponent } from "@cloudcanvas/types";

export default {
  title: "components/layout/BaseComponent",
  component: BaseComponent,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: BaseComponentProps) => () =>
  (
    <BaseStory>
      <BaseComponent {...args} />
    </BaseStory>
  );
// Reuse that template for creating different stories

export const AuthorisedAndPlaying = Template(dcpZeroed);

export const AuthorisedAndPaused = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    component: {
      ...dcpZeroed.state.component,
      state: {
        ...dcpZeroed.state.component.state,
        playing: false,
      },
    },
    authorisation: "authorized",
  },
});

export const UnauthorisedAndPlaying = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    component: {
      ...dcpZeroed.state.component,
      state: {
        ...dcpZeroed.state.component.state,
        playing: true,
      },
    },
    authorisation: "expired",
  },
});

export const UnauthorisedAndPaused = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    component: {
      ...dcpZeroed.state.component,
      state: {
        ...dcpZeroed.state.component.state,
        playing: false,
      },
    },
    authorisation: "expired",
  },
});

export const Selected = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    component: {
      ...dcpZeroed.state.component,
      state: {
        ...dcpZeroed.state.component.state,
        selected: true,
      },
    },
  },
});

export const MovesMoreOnAScaledOutCanvas = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    scale: 0.25,
  },
});

export const MovesLessOnAScaledInCanvas = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    scale: 10,
  },
});

export const AwsComponentShowingInformation = Template({
  ...dcpZeroed,
  state: {
    ...dcpZeroed.state,
    component: {
      ...dcpZeroed.state.component,
      name: "DynamoDB stream poller",
      config: {
        accountId: "123456789",
        region: "us-east-1",
        permissionSet: "DeveloperAccess",
      },
    } as AwsComponent<unknown, unknown>,
  },
});
