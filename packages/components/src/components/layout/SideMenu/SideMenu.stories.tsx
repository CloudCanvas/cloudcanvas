import React from "react";
import { sampleOrgs } from "../../../utils/storyUtils";
import SideMenu, { SideMenuProps } from "./SideMenu";
import "bulma/css/bulma.css";

export default {
  title: "components/layout/SideMenu",
  component: SideMenu,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

const defaultProps: SideMenuProps = {
  state: { organisations: sampleOrgs, expanded: true },
  dispatch: {
    authorise: async (_accessPair) => {
      window.alert("authorise");
    },
    grabCredentials: async (_accessPair) => {
      window.alert("grabCredentials");
    },
    onChangeExpanded: async (_expanded) => {
      window.alert("onChangeExpanded");
    },
    onRenameOrg: async (_organisation) => {
      window.alert("onRenameOrg");
    },
    onRefreshOrg: async (_organisation) => {
      window.alert("onRenameOrg");
    },
    onDeleteOrg: async (_organisation) => {
      window.alert("onDeleteOrg");
    },
    onAddOrg: async () => {
      window.alert("onAddOrg");
    },
    onRenameAccount: async (_organisation) => {
      window.alert("onRenameAccount");
    },
  },
};

// Create a master template for mapping args to render the DynamoWatcher component
const Template =
  (args: SideMenuProps, width: number | undefined = undefined) =>
  () =>
    (
      <div
        className="template-wrapper"
        style={{ maxWidth: width, height: "100%" }}
      >
        <SideMenu {...args} />
      </div>
    );
// Reuse that template for creating different stories

export const StandardMenu = Template(defaultProps);

export const MinimisedStandardMenu = Template({
  ...defaultProps,
  state: { ...defaultProps.state, expanded: false },
});

export const MinimisedStandardMenuWithExpriringCreds = Template({
  ...defaultProps,
  state: {
    ...defaultProps.state,
    expanded: false,
    organisations: sampleOrgs.map((so) => ({
      ...so,
      authorisedUntil: new Date(+new Date() + 1000),
    })),
  },
});

export const StandardMenuAtWidth = Template(defaultProps, 400);
