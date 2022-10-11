import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DMContent } from "../../Primitives/DropdownMenu";
import { RowButton } from "../../Primitives/RowButton";
import { SmallIcon } from "../../Primitives/SmallIcon";
import { ToolButton } from "../../Primitives/ToolButton";
import styled from "stitches.config";
import { useStateDesigner } from "@state-designer/react";
import { machine } from "state/machine";
import { Account, AppData } from "state/constants";
import { Divider } from "components/Primitives/Divider";
import { AddAccountDialog } from "../AddAccountDialog/AddAccountDialog";
import { useContainer } from "useCoreApp";

const accountSelector = (s: AppData) => s.page.accounts || {};

export function AccountMenu() {
  const appState = useStateDesigner(machine);

  const accounts = accountSelector(appState.data);

  const rIsOpen = React.useRef(false);

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (rIsOpen.current !== isOpen) {
      rIsOpen.current = isOpen;
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (rIsOpen.current !== isOpen) {
        setIsOpen(isOpen);
      }
    },
    [setIsOpen]
  );

  return (
    <DropdownMenu.Root dir="ltr" open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger dir="ltr" asChild id="TD-Page">
        <ToolButton variant="text">
          Accounts ({Object.values(accounts).length})
        </ToolButton>
      </DropdownMenu.Trigger>
      <DMContent variant="menu" align="start" sideOffset={4}>
        {isOpen && <AccountMenuContent accounts={Object.values(accounts)} />}
      </DMContent>
    </DropdownMenu.Root>
  );
}

function AccountMenuContent({ accounts }: { accounts: Account[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAddAccount = () => {
    machine;
  };

  const container = useContainer();

  return (
    <>
      <DropdownMenu.RadioGroup dir="ltr">
        {accounts.map((account, i) => (
          <ButtonWithOptions key={account.accountId}>
            <DropdownMenu.RadioItem
              title={account.name}
              value={account.accountId}
              asChild
              draggable={false}
            >
              <PageButton>
                <span>{account.name}</span>

                <DropdownMenu.ItemIndicator>
                  <SmallIcon>
                    <CheckIcon />
                  </SmallIcon>
                </DropdownMenu.ItemIndicator>
              </PageButton>
            </DropdownMenu.RadioItem>
          </ButtonWithOptions>
        ))}
      </DropdownMenu.RadioGroup>

      <Divider />

      <AddAccountDialog
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        isOpen={isOpen}
      />
    </>
  );
}

const ButtonWithOptions = styled("div", {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gridAutoFlow: "column",
  margin: 0,

  '& > *[data-shy="true"]': {
    opacity: 0,
  },

  '&:hover > *[data-shy="true"]': {
    opacity: 1,
  },

  variants: {
    isDropAbove: {
      true: {
        "&::after": {
          content: "",
          display: "block",
          position: "absolute",
          top: 0,
          width: "100%",
          height: "1px",
          backgroundColor: "$selected",
          zIndex: 999,
          pointerEvents: "none",
        },
      },
    },
    isDropBelow: {
      true: {
        "&::after": {
          content: "",
          display: "block",
          position: "absolute",
          width: "100%",
          height: "1px",
          top: "100%",
          backgroundColor: "$selected",
          zIndex: 999,
          pointerEvents: "none",
        },
      },
    },
  },
});

export const PageButton = styled(RowButton, {
  minWidth: 128,
});
