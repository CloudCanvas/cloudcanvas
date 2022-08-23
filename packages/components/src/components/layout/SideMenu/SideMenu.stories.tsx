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
    authorise: async (accessPair) => {
      window.alert("authorise");
    },
    grabCredentials: async (accessPair) => {
      window.alert("grabCredentials");
    },
    onChangeExpanded: async (expanded) => {
      window.alert("onChangeExpanded");
    },
    onRenameOrg: async (organisation) => {
      window.alert("onRenameOrg");
    },
    onDeleteOrg: async (organisation) => {
      window.alert("onDeleteOrg");
    },
    onAddOrg: async () => {
      window.alert("onAddOrg");
    },
    onRenameAccount: async (organisation) => {
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

export const StandardMenuAtWidth = Template(defaultProps, 400);
