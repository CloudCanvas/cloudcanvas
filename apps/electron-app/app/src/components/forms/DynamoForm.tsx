import React, { useEffect } from "react";
import {
  Autosuggest,
  Box,
  Button,
  Form,
  FormField,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components";
import { observer } from "mobx-react-lite";
import { regions } from "../../domain/aws";
import { useStores } from "../../store";
import { AwsRegion } from "@cloudcanvas/aws-sso-sdk-wrapper";
import * as Components from "@cloudcanvas/components/";

// Eeek should not have called the same thing

type Props = {
  onFinished: () => void;
};
export default observer((props: Props) => {
  const { aws, component, dynamo } = useStores();
  const [ssoUrl, setSsoUrl] = React.useState<string | undefined>(
    aws.activeOrg?.nickname || aws.activeOrg?.ssoStartUrl
  );
  const [account, setAccount] = React.useState<string | undefined>(
    aws.activeAcc?.accountId
  );
  const [region, setRegion] = React.useState<string>("");

  const [permissionSet, setPermissionSet] = React.useState<string>("");

  const [selectedTable, setSelectedTable] = React.useState<string | undefined>(
    undefined
  );
  const [tables, setTables] = React.useState<string[]>([]);
  const [loadingTables, setLoadingTables] = React.useState<boolean>(true);

  const selectedOrg = aws.organisations.find((o) => o.ssoStartUrl === ssoUrl);
  const selectedAcc = selectedOrg?.accounts.find(
    (a) => a.accountId === account
  );

  useEffect(() => {
    const fetchTables = async () => {
      try {
        if (!account || !permissionSet) {
          setTables([]);
          return;
        }

        setLoadingTables(true);

        const tables = await dynamo.fetchTables({
          accountId: account,
          permissionSet: permissionSet,
          region: region as AwsRegion,
        });

        setTables(tables);
      } catch (err) {
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [permissionSet]);

  return (
    <Form
      actions={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={() => {
                props.onFinished();
              }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={
                !ssoUrl ||
                !account ||
                !permissionSet ||
                !selectedTable ||
                !region
              }
              onClick={() => {
                component.addComponentFromModal({
                  id: "",
                  title: selectedTable!,
                  layout: {
                    size: [900, 500],
                    location: [0, 0],
                    lastLocation: [0, 0],
                  },
                  playing: true,
                  def: Components.Core.DynamoWatcherComponentDef,
                  config: {
                    ssoUrl: ssoUrl,
                    accountId: account,
                    region: region,
                    permissionSet: permissionSet,
                  },
                  selected: false,
                  props: {
                    tableName: selectedTable,
                  },
                });

                props.onFinished();
              }}>
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween direction="vertical" size="l">
        {/* TODO Add need for authorising */}
        <FormField label="Organisation">
          <Select
            selectedOption={{ value: ssoUrl }}
            onChange={({ detail }) => {
              if (detail.selectedOption.value !== ssoUrl) {
                setAccount(undefined);
                setPermissionSet("");
                setSelectedTable(undefined);
              }
              setSsoUrl(detail.selectedOption.value);
            }}
            options={aws.organisations.map((org) => ({
              label: org.nickname || org.ssoStartUrl,
              value: org.ssoStartUrl,
            }))}
            placeholder="Select organisation"
            selectedAriaLabel="Organisation"
          />
        </FormField>

        {ssoUrl && (
          <FormField label="Account">
            <Select
              selectedOption={{ value: account }}
              onChange={({ detail }) => {
                if (detail.selectedOption.value !== account) {
                  setPermissionSet("");
                  setSelectedTable(undefined);
                }

                setAccount(detail.selectedOption.value);
              }}
              options={selectedOrg?.accounts.map((acc) => ({
                label: acc.name || acc.accountId,
                value: acc.accountId,
              }))}
              placeholder="Select account"
              selectedAriaLabel="Account"
            />
          </FormField>
        )}

        {ssoUrl && (
          <FormField label="Region">
            <Autosuggest
              onChange={({ detail }) => {
                setRegion(detail.value);
              }}
              value={region}
              options={regions.map((region) => ({
                value: region,
              }))}
              invalid={false}
              // No way to run off being able to enter any text so we just ignore it in "onChange"
              enteredTextLabel={(value) => `"${value}"`}
              ariaLabel="The AWS Region of the table "
              placeholder="Enter region"
              empty="No regions found"
            />
          </FormField>
        )}

        {account && (
          <FormField label="Permission set">
            <Autosuggest
              onChange={({ detail }) => {
                setPermissionSet(detail.value);
              }}
              value={permissionSet}
              options={selectedAcc?.roles.map((role) => ({
                value: role,
              }))}
              invalid={false}
              // No way to run off being able to enter any text so we just ignore it in "onChange"
              enteredTextLabel={(value) => `"${value}"`}
              ariaLabel="The permission set to use."
              placeholder="Enter permission set"
              empty="No matching permission set found"
            />
          </FormField>
        )}

        {permissionSet && (
          <FormField label="Table">
            <Select
              selectedOption={{ value: selectedTable }}
              onChange={({ detail }) => {
                setSelectedTable(detail.selectedOption.value);
              }}
              statusType={loadingTables ? "loading" : "finished"}
              options={tables?.map((table) => ({
                label: table,
                value: table,
              }))}
              placeholder="Select table"
              selectedAriaLabel="Table"
              loadingText="Loading tables..."
              empty="No tables found"
            />
          </FormField>
        )}
      </SpaceBetween>
    </Form>
  );
});
