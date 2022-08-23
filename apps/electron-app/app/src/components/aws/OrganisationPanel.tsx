import React, { useEffect } from "react";

import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Icon from "@cloudscape-design/components/icon";
import Popover from "@cloudscape-design/components/popover";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import { ssoBridge } from "../../entrypoints/aws";
import { styles } from "../../styles/core";
import { observer } from "mobx-react";
import { useStores } from "../../store";
import {
  Badge,
  Button,
  ButtonDropdown,
  SpaceBetween,
} from "@cloudscape-design/components";
import "./OrganisationPanel.css";
import DefaultFormModal from "../modal/DefaultFormModal";
import AddOrgForm from "../forms/AddOrgForm";
import AddNicknameForm from "../forms/AddNicknameForm";
import useInterval from "../../hooks/useInterval";
import { toJS } from "mobx";

const dateInHours = (dt: Date) => {
  return `${dt.getHours()}:${dt.getMinutes()}`;
};

export const OrganisationPanel = observer(() => {
  const { aws } = useStores();
  const [addingOrg, setAddingOrg] = React.useState(false);
  const [addingNickname, setAddingNickname] = React.useState<string>("");

  useEffect(() => {
    ssoBridge.access().then(aws.setAccess);
  }, []);

  // useEffect(() => {
  //   if (aws.orgs.length > 0 && !aws.activeOrg) {
  //     aws.setActiveOrg(aws.orgs[0]);
  //   }
  // }, [aws.orgs]);

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <div style={{ marginTop: 5, marginLeft: 5 }}>
              <Popover
                dismissButton={false}
                position="top"
                size="small"
                renderWithPortal={true}
                triggerType="custom"
                content={
                  <StatusIndicator type="success">
                    {`A core component you can't delete as it controls the
                      organisations you can access.You can move it around
                      though 😉.`}
                  </StatusIndicator>
                }>
                <Icon name="lock-private" />
              </Popover>
            </div>
          }>
          Organisations
        </Header>
      }>
      {aws.organisations.map((org, i) => {
        const active =
          aws?.activeOrg?.ssoStartUrl &&
          org.ssoStartUrl === aws?.activeOrg?.ssoStartUrl;

        return (
          <div
            key={org.ssoStartUrl}
            style={{
              background: active ? styles.orange : styles.bg,
              paddingLeft: 16,
              paddingRight: 16,
              borderBottom: "1px solid lightgray",
              borderTop: i === 0 ? "1px solid lightgray" : "",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "stretch",
              }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: 16,
                  paddingBottom: 16,
                  flex: 1,
                }}
                onClick={() => {
                  aws.setActiveOrg(org);
                }}>
                <h2
                  style={{
                    color: active ? styles.contrastText : styles.blue,
                    fontWeight: "bold",
                  }}>
                  {org.nickname || org.ssoStartUrl}
                </h2>

                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "lighter",
                    paddingTop: "0px",
                    color: active ? styles.contrastText : styles.primaryText,
                  }}>
                  {org.nickname
                    ? `${org.ssoStartUrl} (${org.ssoRegion})`
                    : org.ssoRegion}
                </p>

                <StatusBadge authorisedUntil={org.authorisedUntil} />
              </div>

              <div
                className="orgDropdown"
                style={{
                  width: 70,
                  paddingLeft: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <ButtonDropdown
                  items={[
                    { text: "Delete", id: "del", disabled: false },
                    {
                      text: org.nickname ? "Edit nickname" : "Add nickname",
                      id: "add-nick",
                      disabled: false,
                    },
                    {
                      text: "Authorise",
                      href: "",
                      id: "authorise",
                      external: true,
                      externalIconAriaLabel: "(opens in new tab)",
                      disabled:
                        org.authorisedUntil &&
                        +org.authorisedUntil > +new Date(),
                    } as any,
                  ]}
                  variant="icon"
                  onItemClick={async (evt) => {
                    if (evt.detail.id === "del") {
                      await aws.deleteOrganisation(org);
                    } else if (evt.detail.id === "add-nick") {
                      setAddingNickname(org.ssoStartUrl);
                    } else if (evt.detail.id === "authorise") {
                      await aws.authoriseOrg(org);
                    }
                  }}></ButtonDropdown>
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
        }}>
        <Button variant="normal" onClick={() => setAddingOrg(true)}>
          Add organisation
        </Button>
      </div>
      <AddOrg open={addingOrg} onClose={() => setAddingOrg(false)} />

      <AddNickname
        open={!!addingNickname}
        onClose={() => setAddingNickname("")}
        ssoStartUrl={addingNickname}
      />
    </Container>
  );
});

type FormProps = {
  onClose: () => void;
  open: boolean;
};
const AddOrg = (props: FormProps) => {
  if (!props.open) return null;

  return (
    <DefaultFormModal>
      <AddOrgForm onClose={props.onClose} />
    </DefaultFormModal>
  );
};

const AddNickname = (props: FormProps & { ssoStartUrl: string }) => {
  if (!props.open) return null;

  return (
    <DefaultFormModal>
      <AddNicknameForm {...props} />
    </DefaultFormModal>
  );
};

const StatusBadge = ({ authorisedUntil }: { authorisedUntil?: Date }) => {
  const [checkDate, setCheckDate] = React.useState(new Date());

  useInterval(() => {
    setCheckDate(new Date());
  }, 15000);
  const authorised = authorisedUntil && +authorisedUntil > +checkDate;

  if (authorised) {
    return (
      <div onClick={(evt) => evt.stopPropagation()}>
        <Popover
          dismissButton={false}
          position="top"
          size="small"
          renderWithPortal={true}
          triggerType="custom"
          content={
            <StatusIndicator type="info">
              Authorised until {dateInHours(authorisedUntil!)}
            </StatusIndicator>
          }>
          <Badge color="blue">Authorised</Badge>
        </Popover>
      </div>
    );
  } else {
    return (
      <div onClick={(evt) => evt.stopPropagation()}>
        <SpaceBetween direction="horizontal" size="l">
          <Badge color="grey">Session expired</Badge>
        </SpaceBetween>
      </div>
    );
  }
};
