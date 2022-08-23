import { SideMenu } from "@cloudcanvas/components";
import { AccessPair, Organisation } from "@cloudcanvas/aws-sso-sdk-wrapper";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { ssoBridge } from "../../entrypoints/aws";
import { useStores } from "../../store";

export default observer(() => {
  const { aws, component } = useStores();
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    const set = window.localStorage.getItem("AWS_EXPANDED");
    if (set === "false") {
      setExpanded(false);
    }
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
    </div>
  );
});
