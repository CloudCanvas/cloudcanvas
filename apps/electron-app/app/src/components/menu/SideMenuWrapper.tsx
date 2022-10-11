import { SideMenu } from "cloudcanvas-components";
import { AccessPair, Organisation } from "cloudcanvas-types";
import { observer } from "mobx-react-lite";
import React from "react";
import { ssoBridge } from "../../entrypoints/aws";
import { useStores } from "../../store";

export default observer(() => {
  const { aws } = useStores();
  const [expanded, setExpanded] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const set = window.localStorage.getItem("AWS_EXPANDED");
    setExpanded(set === "true");
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem("AWS_EXPANDED", expanded + "");
  }, [expanded]);

  React.useEffect(() => {
    ssoBridge
      .access()
      .then(aws.setAccess)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        background: "white",
      }}>
      {expanded !== undefined && (
        <SideMenu
          state={{
            organisations: aws.organisations,
            // TODO Hook ups
            expanded: expanded,
          }}
          dispatch={{
            authorise: async (org: Organisation) => {
              await aws.authoriseOrg(org);
            },
            grabCredentials: async (accessPair: AccessPair) => {
              await aws.grabCreds(accessPair);
            },
            onChangeExpanded: async (expandedUpdate) => {
              setExpanded(expandedUpdate);
            },
            onRenameOrg: async (org) => {
              aws.setAddingNicknameToOrg(org.ssoStartUrl);
            },
            onRefreshOrg: async (org) => {
              await aws.refreshOrg(org);
              window.alert("Accounts refreshed");
            },
            onDeleteOrg: async (org) => {
              aws.deleteOrganisation(org);
            },
            onAddOrg: async () => {
              aws.setAddingOrg(true);
            },
            onRenameAccount: async (org) => {
              window.alert("Not supported yet");
            },
          }}
        />
      )}
    </div>
  );
});
