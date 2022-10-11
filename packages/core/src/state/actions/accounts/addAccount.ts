import type { Account, Action } from "state/constants";

export const addAccount: Action = (data, payload: { account: Account }) => {
  try {
    if (!data.page.accounts) {
      data.page.accounts = {};
    }
    data.page.accounts[payload.account.accountId] = payload.account;
  } catch (e: any) {
    e.message = "Could not add account: " + e.message;
    console.error(e);
  }
};
