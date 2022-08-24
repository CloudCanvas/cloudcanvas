import React, { useEffect } from "react";
import {
  AccessPair,
  Account,
  Organisation,
} from "@cloudcanvas/aws-sso-sdk-wrapper";
import {
  Alert,
  Button,
  ButtonDropdown,
  Header,
  Icon,
  SpaceBetween,
  StatusIndicator,
  TextContent,
} from "@cloudscape-design/components";

import "./SideMenu.css";
import { centered } from "../../../utils/layoutUtils";

export type SideMenuProps = {
  state: {
    organisations: Organisation[];
    expanded: boolean;
  };
  dispatch: {
    authorise: (organisation: Organisation) => Promise<void>;
    grabCredentials: (accessPair: AccessPair) => Promise<void>;
    onChangeExpanded: (expanded: boolean) => void;
    onRenameOrg: (organisation: Organisation) => Promise<void>;
    onDeleteOrg: (organisation: Organisation) => Promise<void>;
    onRefreshOrg: (organisation: Organisation) => Promise<void>;
    onAddOrg: () => Promise<void>;
    onRenameAccount: (organisation: Organisation) => Promise<void>;
  };
};

type Dispatch = SideMenuProps["dispatch"];

export default (props: SideMenuProps) => {
  const [height, setHeight] = React.useState(0);

  const measuredRef = React.useCallback((node: HTMLElement) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      style={{
        width: props.state.expanded ? 450 : 60,
        height: "100%",
        background: "white",
        borderRightWidth: 1,
        borderRightColor: "lightgray",
        borderRightStyle: "solid",
        position: "relative",
      }}
      id="side-menu-container"
      className={props.state.expanded ? "" : "expanded"}
      // @ts-ignore
      ref={measuredRef}
    >
      {props.state.expanded && <ExpandedMenu {...props} />}
      {!props.state.expanded && <LittleMenu {...props} />}

      <div
        style={{
          position: "absolute",
          right: -15,
          top: height / 2,
          width: 30,
          height: 30,
          borderRadius: 15,
          background: "#4263eb",
          cursor: "pointer",
          ...centered,
        }}
        onClick={() => props.dispatch.onChangeExpanded(!props.state.expanded)}
      >
        <Icon
          variant="inverted"
          name={
            props.state.expanded ? "caret-left-filled" : "caret-right-filled"
          }
        />
      </div>
    </div>
  );
};

const LittleMenu = (props: SideMenuProps) => {
  return (
    <div style={{ padding: 8, overflow: "scroll" }}>
      <div style={{ paddingLeft: 16, opacity: 0 }}>
        <Header variant="h3"></Header>
      </div>

      <Separator />

      <div style={{ height: 8 }}></div>

      {props.state.organisations
        .filter((o) => !o.logicallyDeleted)
        .map((org, i) => {
          const authorised =
            org.authorisedUntil && +org.authorisedUntil > +new Date();
          return (
            <div
              className={`tile ${authorised ? "authorised" : "expired"}`}
              key={org.ssoStartUrl}
            >
              <div className="tile-content">
                <TextContent>
                  <h4 style={{ color: "white", cursor: "pointer" }}>
                    {org.nickname ? org.nickname[0] : `#${i}`}
                  </h4>
                </TextContent>
              </div>

              <div className="tile-content">
                <OrgDropdown org={org} d={props["dispatch"]} small={true} />
              </div>
            </div>
          );
        })}

      <div
        style={{
          marginTop: -10,
          padding: "10px 0px",
        }}
      >
        <Separator />
      </div>

      <div
        style={{
          padding: "0px",
        }}
      >
        <div
          className="tile"
          style={{
            borderStyle: "solid",
            borderWidth: 2,
            backgroundColor: "white",
            borderColor: "#0872d3",
            ...centered,
          }}
          onClick={props.dispatch.onAddOrg}
        >
          <TextContent>
            <h4 style={{ color: "#0872d3", cursor: "pointer" }}>+</h4>
          </TextContent>
        </div>
      </div>
    </div>
  );
};

const ExpandedMenu = (props: SideMenuProps) => {
  const [displayAlert, setDisplayAlert] = React.useState(false);

  useEffect(() => {
    const set = window.localStorage.getItem("GLOBAL_AWS_WARNING");
    if (!set) {
      setDisplayAlert(true);
    }
  }, []);

  return (
    <div style={{ padding: 8, overflow: "scroll" }}>
      <Alert
        onDismiss={() => {
          setDisplayAlert(false);
          window.localStorage.setItem("GLOBAL_AWS_WARNING", "viewed");
        }}
        visible={displayAlert}
        dismissAriaLabel="Close alert"
        dismissible
        header="Your global AWS access center"
      >
        A central place to manage your AWS access. It is initially populated
        with details form your <code>~/.aws/config</code> file.
      </Alert>

      <div style={{ paddingLeft: 16 }}>
        <Header variant="h3">Global AWS Access</Header>
      </div>

      <Separator />

      <div style={{ height: 8 }}></div>

      {props.state.organisations
        .filter((o) => !o.logicallyDeleted)
        .map((org) => {
          return (
            <OrganisationMenu
              org={org}
              key={org.ssoStartUrl}
              d={props["dispatch"]}
            />
          );
        })}

      <div
        style={{
          padding: "20px 0px",
        }}
      >
        <Separator />
      </div>

      <div
        style={{
          padding: "0px 30px",
        }}
      >
        <Button variant="normal" onClick={props.dispatch.onAddOrg}>
          Add organisation
        </Button>
      </div>
    </div>
  );
};

const OrganisationMenu = ({ org, d }: { org: Organisation; d: Dispatch }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ margin: "8px 0px" }} className="organisation">
      <TextContent>
        <h5 className="side-menu-org">
          <OrgDropdown org={org} d={d} />
          <span
            style={{ marginRight: 8 }}
            aria-open={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name="caret-right-filled" />
          </span>
          <span onClick={() => setOpen(!open)}>
            {org.nickname || org.ssoStartUrl}
          </span>
        </h5>
        <span className="organisation-status">
          {org.authorisedUntil && +org.authorisedUntil > +new Date() && (
            <StatusIndicator type="success">
              Authorised until 21:04
            </StatusIndicator>
          )}
          {(!org.authorisedUntil || +org.authorisedUntil < +new Date()) && (
            <StatusIndicator type="stopped">
              Session expired,{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  d.authorise(org);
                }}
              >
                refresh
              </a>
            </StatusIndicator>
          )}
        </span>
      </TextContent>
      <div style={{ paddingLeft: 32 }} className="account">
        {org.accounts.map((a) => (
          <AccountMenu
            org={org}
            acc={a}
            key={a.accountId}
            display={open}
            d={d}
          />
        ))}
      </div>
    </div>
  );
};

const AccountMenu = ({
  org,
  acc,
  display,
  d,
}: {
  org: Organisation;
  acc: Account;
  display: boolean;
  d: Dispatch;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ margin: "8px 0px", display: display ? "block" : "none" }}>
      <TextContent>
        <p>
          <span
            style={{ marginRight: 8, position: "relative", top: 0 }}
            aria-open={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name="caret-right-filled" />
          </span>
          <span onClick={() => setOpen(!open)}>
            {acc.name ? `${acc.name} (#${acc.accountId})` : acc.accountId}
          </span>
        </p>
      </TextContent>

      <div style={{ paddingLeft: 32 }}>
        {acc.roles.map((r) => (
          <Role
            role={r}
            org={org}
            acc={acc}
            display={open}
            key={`${acc.accountId}-${r}`}
          />
        ))}
      </div>
    </div>
  );
};

const Role = ({
  role,
  org,
  acc,
  display,
}: {
  role: string;
  org: Organisation;
  acc: Account;
  display: boolean;
}) => {
  return (
    <div style={{ margin: "8px 0px", display: display ? "block" : "none" }}>
      <TextContent key={`${acc.accountId}-${role}`}>
        <p>
          {role}{" "}
          {org.authorisedUntil && +org.authorisedUntil > +new Date() && (
            <SpaceBetween direction="horizontal" size="xs">
              <a>Launch terminal</a>
              <a>Launch browser</a>
            </SpaceBetween>
          )}
        </p>
      </TextContent>
    </div>
  );
};

const OrgDropdown = ({
  org,
  d,
  small,
}: {
  org: Organisation;
  d: Dispatch;
  small?: boolean;
}) => {
  const authorised = org.authorisedUntil && +org.authorisedUntil > +new Date();
  const items: any[] = [];

  if (!authorised) {
    items.push({
      text: "Authorise",
      id: "auth",
      disabled: false,
    });
  }

  items.push(
    ...[
      { text: "Refresh accounts", id: "refresh", disabled: false },
      { text: "Delete", id: "del", disabled: false },
      {
        text: org.nickname ? "Edit nickname" : "Add nickname",
        id: "add-nick",
        disabled: false,
      },
    ]
  );

  // TODO Raise issue with button dropdown
  if (small) {
    items.push({
      id: "accounts",
      text: "Accounts",
      items: org.accounts
        .slice()
        .sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else if (!a.name) {
            return 10;
          } else if (!b.name) {
            return -10;
          } else {
            return a.accountId.localeCompare(b.accountId);
          }
        })
        .map((acc) => ({
          id: acc.accountId,
          text: acc.name || acc.accountId,
          items: [
            {
              id: acc.accountId + "|terminal",
              text: "Launch terminal",
            },
            {
              id: acc.accountId + "|browser",
              text: "Launch browser  ",
            },
          ],
        })),
    });
  }
  return (
    <ButtonDropdown
      className="dropdown"
      expandToViewport
      items={items}
      expandableGroups={!!small}
      variant="icon"
      onItemClick={async (evt) => {
        if (evt.detail.id === "auth") {
          await d.authorise(org);
        } else if (evt.detail.id === "refresh") {
          await d.onRefreshOrg(org);
        } else if (evt.detail.id === "del") {
          await d.onDeleteOrg(org);
        } else if (evt.detail.id === "add-nick") {
          await d.onRenameOrg(org);
        }
      }}
    ></ButtonDropdown>
  );
};

const Separator = () => (
  <div style={{ height: 2, margin: "8px 0px", background: "#e9ebed" }} />
);
