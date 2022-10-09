import type { Account, Action } from "state/constants";

export const addAccount: Action = (data, payload: { account: Account }) => {
  try {
    data.page.accounts[payload.account.accountId] = payload.account;
  } catch (e: any) {
    e.message = "Could not create shapes: " + e.message;
    console.error(e);
  }
};
