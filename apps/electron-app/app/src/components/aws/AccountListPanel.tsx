import React, { useEffect } from "react";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Icon from "@cloudscape-design/components/icon";
import Spinner from "@cloudscape-design/components/spinner";
import { styles } from "../../styles/core";
import { observer } from "mobx-react";
import { useStores } from "../../store";
import { Organisation } from "@cloudcanvas/aws-sso-sdk-wrapper";
import {
  Alert,
  Badge,
  ButtonDropdown,
  Popover,
  StatusIndicator,
} from "@cloudscape-design/components";

export const AccountListPanel = observer(() => {
  const { aws } = useStores();

  const [authorising, setAuthorising] = React.useState(false);

  const auth = async (org: Organisation): Promise<void> => {
    try {
      setAuthorising(true);

      await aws.refreshOrg(org);
    } catch (err) {
      window.alert("Auth failed");
      return undefined;
    } finally {
      setAuthorising(false);
    }
  };

  if (!aws.activeOrg) {
    return null;
  }

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                onClick={() => {
                  auth(aws.activeOrg!);
                }}>
                Refresh
              </Button>
              <div style={{ marginTop: 5, marginLeft: 5 }}>
                <Icon name="lock-private" />
              </div>
            </SpaceBetween>
          }>
          Accounts
        </Header>
      }>
      <div style={{ minWidth: 350 }}>
        {authorising && (
          <div
            style={{
              width: 350,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Spinner />
          </div>
        )}

        <div style={{ width: "100%", maxWidth: 350 }}>
          <Alert
            type="info"
            visible={aws.activeOrg?.accounts.length === 0}
            header="No accounts yet">
            Click "Refresh" to authorise against your SSO provider and load all
            accounts.
          </Alert>
        </div>

        {aws.activeOrg?.accounts
          .slice()
          .sort((a, b) =>
            (a.name || a.accountId).localeCompare(b.name || b.accountId)
          )
          .map((account, i) => {
            const active =
              aws.activeAcc && account.accountId === aws.activeAcc.accountId;

            return (
              <div
                key={`${account.accountId}-${i}`}
                className="app__accounts__item"
                data-filepath={account.accountId}
                style={{
                  background: active ? styles.orange : styles.bg,
                  padding: "16px",
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
                    style={{ flex: 1 }}
                    onClick={() => {
                      aws.setActiveAcc(account);
                    }}>
                    <SpaceBetween direction="horizontal" size="s">
                      <Icon name="folder" />
                      <h2
                        style={{
                          color: active ? styles.contrastText : styles.blue,
                          fontWeight: "bold",
                        }}>
                        {account.name
                          ? `${account.name} ( ${account.accountId})`
                          : account.accountId}
                      </h2>
                    </SpaceBetween>

                    <p
                      className="app__accounts__item__info__size"
                      style={{
                        fontSize: "10px",
                        fontWeight: "lighter",
                        color: active
                          ? styles.contrastText
                          : styles.primaryText,
                      }}>
                      {account.defaultRegion}
                    </p>

                    {active && (
                      <Popover
                        dismissButton={false}
                        position="top"
                        size="small"
                        renderWithPortal={true}
                        triggerType="custom"
                        content={
                          <StatusIndicator type="info">
                            Resource creation will default to this account.
                          </StatusIndicator>
                        }>
                        <Badge color="blue">Default account</Badge>
                      </Popover>
                    )}
                  </div>

                  <div
                    className="accountDropdown"
                    style={{
                      width: 70,
                      paddingLeft: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <ButtonDropdown
                      items={account.roles
                        .slice()
                        .sort((a, b) => a.localeCompare(b))
                        .map(
                          (r) =>
                            ({
                              text: `Copy ${r} console creds`,
                              id: `${account.accountId}|${r}`,
                              // external: true,
                              // externalIconAriaLabel: "(opens in new tab)",
                            } as any)
                        )}
                      expandToViewport={true}
                      variant="icon"
                      onItemClick={async (evt) => {
                        const [accountId, permissionSet] =
                          evt.detail.id.split("|");
                        await aws.grabCreds(accountId, permissionSet);
                      }}></ButtonDropdown>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Container>
  );
});
