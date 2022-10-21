import React from "react";
import {
  Autosuggest,
  Box,
  Button,
  Form,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { observer } from "mobx-react-lite";
import { useStores } from "../../store";
import { regions } from "../../domain/aws";

type Props = {
  onClose: () => void;
};
export default observer((props: Props) => {
  const { aws } = useStores();
  const [ssoUrl, setSsoUrl] = React.useState<string>("");
  const [region, setRegion] = React.useState<string>("");

  const validRegion = regions.some((r) => r === region);

  return (
    <Form
      actions={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={() => {
                props.onClose();
              }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!ssoUrl || !validRegion}
              onClick={async () => {
                await aws.addOrganisation({
                  ssoStartUrl: ssoUrl,
                  ssoRegion: region,
                });

                props.onClose();
              }}>
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween direction="vertical" size="l">
        <FormField label="SSO start URL">
          <Input
            autoFocus
            value={ssoUrl}
            placeholder="Your organisational single sign-on URL"
            onChange={(event) => {
              setSsoUrl(event.detail.value);
            }}
          />
        </FormField>

        <FormField label="SSO region">
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
            ariaLabel="The AWS Region SSO is hosted "
            placeholder="Enter region"
            empty="No regions found"
          />
        </FormField>
      </SpaceBetween>
    </Form>
  );
});
