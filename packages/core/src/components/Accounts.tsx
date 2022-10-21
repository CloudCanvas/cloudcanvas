import * as React from "react";
import { ArrowUpRight, Edit2, MousePointer, Square, X } from "react-feather";
import { Button, TextContent } from "cloudcanvas-components";
import { Account } from "state/constants";
import { machine } from "state/machine";
import styled from "stitches.config";

interface AccountProps {}

const onAddAccount = (account: Account) => {
  machine.send("ADD_ACCOUNT", { account });
};

export function Accounts() {
  return (
    <AccountContainer>
      <AccountList>
        <h2>
          <TextContent>Accounts</TextContent>
        </h2>
      </AccountList>
      <Line />
      <Line />

      <AddAccount>
        <p>
          <TextContent>Add an AWS account to play with.</TextContent>
        </p>

        <Button>Add account</Button>
      </AddAccount>
    </AccountContainer>
  );
}

const AccountContainer = styled("div", {
  gridTemplateColumns: "1fr",
  position: "fixed",
  top: "$2",
  right: "$2",
  zIndex: "100",
  borderRadius: 10,
  minWidth: 200,
  border: "2px solid $border",
  overflow: "hidden",
  backgroundColor: "$background",
});

const AccountList = styled("div", {
  display: "flex",
  flexDirection: "column",
  // height: "fit-content",
  // width: "fit-content",
  padding: "5px",
  justifySelf: "center",
});

const AddAccount = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "5px",
  justifySelf: "center",
  backgroundColor: "$background",
});

const Highlight = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  padding: 10,
  borderRadius: "100%",
  transition: "background-color .025s",
});

const Line = styled("div", {
  background: "$border",
  width: "100%",
  height: 2,
  margin: "$2",
});

const PrimaryToolButton = styled("button", {
  cursor: "pointer",
  width: "40px",
  height: "40px",
  padding: 2,
  margin: 0,
  background: "none",
  backgroundColor: "none",
  border: "none",
  color: "$text",

  variants: {
    isActive: {
      true: {
        color: "$background",
        [`& > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
      false: {
        [`&:hover > ${Highlight}`]: {
          backgroundColor: "$hover",
        },
        "&:active": {
          color: "$background",
        },
        [`&:active > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
    },
  },
});

const StatusBar = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderTop: "1px solid $border",
  fontSize: "$1",
  fontWeight: "$1",
  backgroundColor: "$background",
  overflow: "hidden",
  whiteSpace: "nowrap",

  "& button": {
    background: "none",
    border: "1px solid $text",
    borderRadius: 3,
    marginRight: "$3",
    fontFamily: "inherit",
    fontSize: "inherit",
    cursor: "pointer",
  },
});
