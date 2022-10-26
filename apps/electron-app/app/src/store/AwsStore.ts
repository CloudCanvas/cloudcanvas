import { LocalAwsBridge } from "../ports/aws";
import Clipboard from "../ports/clipboard";
import { Access, AccessPair, Account, Organisation } from "cloudcanvas-types";
import { makeAutoObservable, runInAction } from "mobx";

export class AwsStore {
  access?: Access = undefined;
  activeOrgId: string | undefined = undefined;
  activeAcc: Account | undefined = undefined;
  addingOrg = false;
  orgAddingNicknameTo = "";

  constructor(private awsClient: LocalAwsBridge, private clipboard: Clipboard) {
    makeAutoObservable(this);
  }

  setAddingOrg = (adding: boolean) => {
    this.addingOrg = adding;
  };

  setAddingNicknameToOrg = (ssoStartUrl: string) => {
    this.orgAddingNicknameTo = ssoStartUrl;
  };

  addOrganisation = async (
    org: Pick<Organisation, "ssoStartUrl" | "ssoRegion">
  ) => {
    if (!org.ssoRegion || !org.ssoStartUrl) {
      window.alert("invalid details");
    }
    const access = await this.awsClient.addOrganisation({
      ssoStartUrl: org.ssoStartUrl,
      ssoRegion: org.ssoRegion,
      accounts: [],
      roles: [],
    });
    this.setAccess(access);
  };

  editNickname = async (
    org: Required<Pick<Organisation, "nickname" | "ssoStartUrl">>
  ) => {
    if (!org.ssoStartUrl) {
      window.alert("invalid details");
    }
    const access = await this.awsClient.provideNickname(
      org.nickname,
      org.ssoStartUrl
    );

    this.setAccess(access);
  };

  deleteOrganisation = async (org: Pick<Organisation, "ssoStartUrl">) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organisation?"
    );

    if (!confirmed) return;

    const access = await this.awsClient.deleteOrganisation(org.ssoStartUrl);
    this.setAccess(access);
  };

  grabCreds = async (accessPair: AccessPair) => {
    const auth = await this.awsClient.lightAuthorise(accessPair);

    const { accessKeyId, secretAccessKey, sessionToken } = auth.credentials;

    const defaultRegion = this.activeOrg?.ssoRegion;

    this.clipboard.writeText(`export AWS_ACCESS_KEY_ID="${accessKeyId}"
export AWS_SECRET_ACCESS_KEY="${secretAccessKey}"
export AWS_SESSION_TOKEN="${sessionToken}"
${defaultRegion ? `export AWS_REGION="${defaultRegion}"` : ""}`);
  };

  setAccess = (access: Access) => {
    runInAction(
      () =>
        (this.access = {
          organisations: access.organisations
            .filter((o) => !o.logicallyDeleted)
            .map((o) => ({
              ...o,
              authorisedUntil: o.authorisedUntil
                ? new Date(o.authorisedUntil)
                : undefined,
            })),
        })
    );
  };

  setActiveOrg = async (org: Organisation) => {
    if (this.activeOrgId === org.ssoStartUrl) {
      this.activeOrgId = undefined;
    } else {
      this.activeOrgId = org.ssoStartUrl;
    }
  };

  authoriseOrg = async (org: Organisation) => {
    const updatedAccess = await this.awsClient.authoriseOrg(org.ssoStartUrl);

    this.setAccess(updatedAccess);
  };

  refreshOrg = async (org: Organisation) => {
    const updatedAccess = await this.awsClient.refreshOrg(org.ssoStartUrl);

    this.setAccess(updatedAccess);
  };

  setActiveAcc = (acc: Account) => {
    this.activeAcc = acc;
  };

  orgForAcc = (accId?: string) => {
    if (!accId) return undefined;

    return this.access?.organisations.find((o) =>
      o.accounts.some((a) => a.accountId === accId)
    );
  };

  orgForUrl = (ssoUrl?: string) => {
    if (!ssoUrl) return undefined;

    return this.access?.organisations.find((o) => o.ssoStartUrl === ssoUrl);
  };

  get organisations() {
    return (this.access?.organisations || []).filter(
      (o) => !o.logicallyDeleted
    );
  }

  get activeOrg() {
    if (!this.activeOrgId) return undefined;

    return this.organisations.find((o) => o.ssoStartUrl === this.activeOrgId!);
  }
}
