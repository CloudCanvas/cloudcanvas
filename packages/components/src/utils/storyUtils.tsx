import { Organisation } from "@cloudcanvas/aws-sso-sdk-wrapper";
import React from "react";

import {
  BaseComponentProps,
  ComponentStatus,
} from "../components/layout/BaseComponent/BaseComponent";
import { DynamoWatcherComponentDef } from "../domain";
import { AwsComponent, Component } from "../domain/core";

import "bulma/css/bulma.css";

export const allGoodStatus: ComponentStatus = {
  authorisation: "authorized",
  playing: true,
};

export const allBadStatus: ComponentStatus = {
  authorisation: "expired",
  playing: false,
};

export const unauthorizedStatus: ComponentStatus = {
  authorisation: "expired",
  playing: true,
};

export const pausedStatus: ComponentStatus = {
  authorisation: "authorized",
  playing: false,
};

export const baseComponent: Component = {
  id: "base-component",
  def: DynamoWatcherComponentDef,
  playing: allGoodStatus.playing,
  selected: false,
  title: "Feedback",
  layout: {
    location: [51000, 50500],
    lastLocation: [0, 0],
    size: [500, 300],
  },
  props: {},
};

export const baseAwsComponent: AwsComponent<any> = {
  ...baseComponent,
  config: {
    ssoUrl: "https://myUrl.com",
    accountId: "123456789",
    region: "us-east-1",
    permissionSet: "AdministratorAccess",
  },
  props: {},
};

export const baseDispatch: BaseComponentProps<unknown, unknown>["dispatch"] = {
  onSelection: (selected) => console.log(`selected ${selected}`),
  onTogglePlay: () => console.log("TOGGLE"),
  onAuthorise: () => console.log("AUTHORISE"),
  onResize: (size) => console.log("RESIZE", size),
  onMove: (size) => console.log("MOVE", size),
};

export const BaseStory = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: 20 }}>{children}</div>
);

export const sampleOrgs: Organisation[] = [
  {
    accounts: [],
    authorisedUntil: undefined,
    roles: [],
    ssoRegion: "us-east-1",
    defaultRegion: "eu-central-1",
    ssoStartUrl: "https://d-39372e2e99.awsapps.com/start#/",
  },
  {
    ssoStartUrl: "https://d-39372e2e6d.awsapps.com/start",
    ssoRegion: "us-east-1",
    accounts: [
      {
        accountId: "5321234567890",
        defaultRegion: "us-east-1",
        roles: ["AdministratorAccess"],
      },
      {
        accountId: "4311234567890",
        defaultRegion: "us-east-1",
        roles: ["AdministratorAccess"],
      },
    ],
    defaultRegion: "eu-central-1",
    roles: ["AdministratorAccess"],
    authorisedUntil: new Date(+new Date() + 1000 * 1000),
  },
  {
    ssoStartUrl: "https://d-39372jk2992.awsapps.com/start#/",
    ssoRegion: "ap-southeast-2",
    accounts: [
      {
        accountId: "331234567890",
        defaultRegion: "ap-southeast-2",
        roles: ["AWSAdministratorAccess"],
      },
    ],
    defaultRegion: "ap-southeast-2",
    roles: ["AWSAdministratorAccess"],
  },
];
