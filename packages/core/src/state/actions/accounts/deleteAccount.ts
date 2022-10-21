import type { Action } from "state/constants";

export const deleteAccount: Action = (data, payload: { accountId: string }) => {
  try {
    delete data.page.accounts[payload.accountId];
  } catch (e: any) {
    e.message = "Could not delete account: " + e.message;
    console.error(e);
  }
};
