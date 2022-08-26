import React from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { observer } from "mobx-react-lite";
import { useStores } from "../../store";

type Props = {
  ssoStartUrl: string;
  onClose: () => void;
};
export default observer((props: Props) => {
  const { aws } = useStores();
  const [ssoUrl] = React.useState<string>(props.ssoStartUrl);
  const [nickname, setNickname] = React.useState<string>(
    aws.organisations.find((o) => o.ssoStartUrl === props.ssoStartUrl)
      ?.nickname || ""
  );

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
              disabled={!ssoUrl}
              onClick={async () => {
                await aws.editNickname({
                  ssoStartUrl: ssoUrl,
                  nickname: nickname!,
                });

                props.onClose();
              }}>
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween direction="vertical" size="l">
        <FormField label="Nickname">
          <Input
            autoFocus
            value={nickname}
            placeholder="A nickname or blank to delete your nickname"
            onChange={(event) => {
              setNickname(event.detail.value);
            }}
          />
        </FormField>
      </SpaceBetween>
    </Form>
  );
});
