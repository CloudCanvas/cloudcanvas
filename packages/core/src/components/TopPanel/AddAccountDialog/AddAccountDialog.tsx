import * as Dialog from "@radix-ui/react-alert-dialog";
import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { Divider } from "../../Primitives/Divider";
import { RowButton, RowButtonProps } from "../../Primitives/RowButton";
import { TextField } from "../../Primitives/TextField";
import styled from "stitches.config";
import { Account } from "state/constants";
import { machine } from "state/machine";
import { TextArea } from "components/Primitives/TextArea";
import { useContainer } from "useCoreApp";
import { isValidCredentials } from "./CredentialsParser";
import { Autosuggest, Multiselect } from "@cloudscape-design/components";
import { OptionDefinition } from "@cloudscape-design/components/internal/components/option/interfaces";

export const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-southeast-3",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
];

interface AddAccountDialogProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

export function AddAccountDialog({
  isOpen,
  onOpen,
  onClose,
}: AddAccountDialogProps) {
  const [accountName, setAccountName] = React.useState("");
  const [accountCredentials, setAccountCredentials] = React.useState("");
  const [hasValidCredentials, setHasValidCredentials] = React.useState(false);
  const [selectedRegion, setSelectedRegion] = React.useState<string>("");

  const rInput = React.useRef<HTMLInputElement>(null);
  const rArea = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = React.useCallback(() => {
    onClose();
  }, []);

  const handleAddAccount = React.useCallback(() => {
    if (!accountName) {
      // Weird workaround for now
      window.alert("Add an account name");
      setTimeout(() => onOpen(), 50);
      return null;
    }
    if (!isValidCredentials(accountCredentials)) {
      // Weird workaround for now
      window.alert(
        "Missing credentials, we recommend copying from your SSO start page."
      );
      setTimeout(() => onOpen(), 50);
      return null;
    }
    if (!selectedRegion) {
      // Weird workaround for now
      window.alert("Add the region you'd like to sketch with");
      setTimeout(() => onOpen(), 50);
      return null;
    }

    const accountToAdd: Account = {
      name: accountName,
      active: true,
      regions: [selectedRegion],
      accountId: "TODO GET ACCOUNT ID",
    };

    // machine.send("ADD_ACCOUNT", { account: accountToAdd });
  }, [machine, accountName, selectedRegion, accountCredentials]);

  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    if (isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, []);

  function stopPropagation(e: React.KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trimStart();
      setAccountName(value);
    },
    []
  );

  const handleTextAreaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value?.trimStart();
      setAccountCredentials(value);
      setHasValidCredentials(isValidCredentials(value));
    },
    []
  );

  const handleTextFieldKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      switch (e.key) {
        case "Enter": {
          break;
        }
        case "Escape": {
          onClose();

          break;
        }
      }
    },
    []
  );

  React.useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        const elm = rInput.current;
        if (elm) {
          elm.focus();
        }
      });
    }
  }, [isOpen]);

  const container = useContainer();

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild data-shy="true">
        <RowButton hasArrow={true}>
          <span>Add account</span>
        </RowButton>
      </Dialog.Trigger>

      <Dialog.Portal container={container.current}>
        <StyledDialogOverlay onPointerDown={handleClose} />
        <StyledDialogContent
          dir="ltr"
          onKeyDown={stopPropagation}
          onKeyUp={stopPropagation}
        >
          <TextField
            ref={rInput}
            placeholder={"Account name"}
            value={accountName}
            onChange={handleTextFieldChange}
            onKeyDown={handleTextFieldKeyDown}
            icon={<Pencil1Icon />}
          />
          <Divider />
          <TextArea
            ref={rArea}
            placeholder={`export AWS_ACCESS_KEY_ID="ASIA********"\nexport AWS_SECRET_ACCESS_KEY="***********"\nexport AWS_SESSION_TOKEN="*******"`}
            value={accountCredentials}
            onChange={handleTextAreaChange}
            onKeyDown={handleTextFieldKeyDown}
            valid={hasValidCredentials}
          />
          <Divider />
          {/* TODO Div class and remove border on child input */}
          <Autosuggest
            onChange={({ detail }) => setSelectedRegion(detail.value)}
            value={selectedRegion}
            options={regions.map((r) => ({ value: r }))}
            enteredTextLabel={(value) => `Use: "${value}"`}
            ariaLabel="Autosuggest for region"
            placeholder="Select a region"
            empty="No matching region found"
          />
          <Divider />
          {/* <DialogAction onSelect={handleDuplicate}>
            <FormattedMessage id="duplicate" />
          </DialogAction>
          <DialogAction disabled={!canDelete} onSelect={handleDelete}>
            <FormattedMessage id="delete" />
          </DialogAction>
          <Divider /> */}
          <DialogAction onSelect={handleAddAccount}>Add</DialogAction>
          <Divider />
          <Dialog.Cancel asChild>
            <RowButton>Cancel</RowButton>
          </Dialog.Cancel>
        </StyledDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* -------------------------------------------------- */
/*                       Dialog                       */
/* -------------------------------------------------- */

export const StyledDialogContent = styled(Dialog.Content, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: 400,
  maxHeight: "85vh",
  marginTop: "-5vh",
  pointerEvents: "all",
  backgroundColor: "$panel",
  padding: "$4",
  borderRadius: "$2",
  font: "$ui",
  zIndex: 999999,
  "&:focus": {
    outline: "none",
  },
});

export const StyledDialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: "rgba(0, 0, 0, .15)",
  position: "absolute",
  pointerEvents: "all",
  inset: 0,
  zIndex: 999998,
});

function DialogAction({
  onSelect,
  ...rest
}: RowButtonProps & {
  onSelect: (e: React.SyntheticEvent<HTMLButtonElement, Event>) => void;
}) {
  return (
    <Dialog.Action asChild onClick={onSelect}>
      <RowButton {...rest} />
    </Dialog.Action>
  );
}
