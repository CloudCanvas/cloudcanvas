import React from "react";
import {
  BaseComponentProps,
  ComponentStatus,
} from "../components/layout/BaseComponent/BaseComponent";
import "bulma/css/bulma.css";
import { AwsShape, Organisation } from "@cloudcanvas/types";

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

export const baseComponent: AwsShape = {
  type: "sso",
  sso: {
    accountId: "123456789",
    permissionSet: "PowerUser",
  },
  region: "us-east-1",
  cloudprovider: "aws",
  resources: [
    {
      resourceId: "Users",
    },
  ],
  title: "Sample component",
};

export const baseDispatch: BaseComponentProps["dispatch"] = {
  onAuthorise: () => console.log("AUTHORISE"),
  onSelection: (selected) => console.log(`selected ${selected}`),
  onTogglePlay: () => console.log("TOGGLE"),
  onResize: (size) => console.log("RESIZE", size),
  onMove: (size) => console.log("MOVE", size),
};

// export const dcp: BaseComponentProps = {
//   state: {
//     component: {
//       ...baseComponent,
//       state: {
//         ...baseComponent.state,
//         layout: {
//           ...baseComponent.state.layout,
//         },
//       },
//     },
//     authorisation: allGoodStatus.authorisation,
//     scale: 1,
//   },
//   dispatch: baseDispatch,
//   children: <div />,
// };

// export const dcpZeroed: BaseComponentProps = {
//   ...dcp,
//   state: {
//     component: baseComponentZeroed,
//     authorisation: allGoodStatus.authorisation,
//     scale: 1,
//   },
//   dispatch: baseDispatch,
//   children: <div />,
// };

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
