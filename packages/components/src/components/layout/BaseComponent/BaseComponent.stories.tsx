import React from "react";
import BaseComponent, { BaseComponentProps } from "./BaseComponent";
import {
  allGoodStatus,
  baseComponent,
  baseDispatch,
  BaseStory,
} from "../../../utils/storyUtils";
import { AwsComponent } from "../../../domain/core";

export default {
  title: "components/layout/BaseComponent",
  component: BaseComponent,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

export const dcp: BaseComponentProps<number[], number> = {
  ports: {
    dataFetcher: {
      delay: 500,
      initialData: [],
      update: (data, update) => [...data, update],
      fetch: async () => Math.round(Math.random() * 100),
    },
  },
  state: {
    component: {
      ...baseComponent,
      layout: {
        ...baseComponent.layout,
        location: [0, 0],
      },
    },
    authorisation: allGoodStatus.authorisation,
    scale: 0.85,
  },
  dispatch: baseDispatch,
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template = (args: BaseComponentProps<number[], number>) => () =>
  (
    <BaseStory>
      <BaseComponent {...args} />
    </BaseStory>
  );
// Reuse that template for creating different stories

export const AuthorisedAndPlaying = Template(dcp);

export const AuthorisedAndPaused = Template({
  ...dcp,
  state: {
    ...dcp.state,
    component: {
      ...dcp.state.component,
      playing: false,
    },
    authorisation: "authorized",
  },
});

export const UnauthorisedAndPlaying = Template({
  ...dcp,
  state: {
    ...dcp.state,
    component: {
      ...dcp.state.component,
      playing: true,
    },
    authorisation: "expired",
  },
});

export const UnauthorisedAndPaused = Template({
  ...dcp,
  state: {
    ...dcp.state,
    component: {
      ...dcp.state.component,
      playing: false,
    },
    authorisation: "expired",
  },
});

export const Selected = Template({
  ...dcp,
  state: {
    ...dcp.state,
    component: {
      ...dcp.state.component,
      selected: true,
    },
  },
});

export const MovesMoreOnAScaledOutCanvas = Template({
  ...dcp,
  state: {
    ...dcp.state,
    scale: 0.25,
  },
});

export const MovesLessOnAScaledInCanvas = Template({
  ...dcp,
  state: {
    ...dcp.state,
    scale: 10,
  },
});

export const AwsComponentShowingInformation = Template({
  ...dcp,
  state: {
    ...dcp.state,
    component: {
      ...dcp.state.component,
      name: "DynamoDB stream poller",
      config: {
        accountId: "123456789",
        region: "us-east-1",
        permissionSet: "DeveloperAccess",
      },
    } as AwsComponent<any>,
  },
});
