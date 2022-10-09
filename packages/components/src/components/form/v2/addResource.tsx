import React, { useEffect } from "react";
import { Command } from "cmdk";
import "../../../base.css";
import "./addResource.scss";
import {
  Account,
  AwsShape,
  AwsCredentials,
  Organisation,
  AWS,
  AwsRegion,
} from "@cloudcanvas/types";
import { regions } from "../../../domain/aws";
import { ComponentCatalogEntry } from "../../../domain";

export type CustomData = { label: string; value: any };

export type AddResourceProps = {
  organisations: Organisation[];
  credentials: AwsCredentials[];
  componentCatalog: ComponentCatalogEntry<any>[];
  onAddShape: (shape: AwsShape) => void;
};

export default (props: AddResourceProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const [credentialsProvider, setCredentialsProvider] = React.useState<
    string | undefined
  >(
    // "sso" | "credentials"
    undefined
  );

  const [region, setRegion] = React.useState<string | undefined>(undefined);

  // SSO
  const [org, setOrg] = React.useState<Organisation | undefined>(undefined);
  const [account, setAccount] = React.useState<Account | undefined>(undefined);
  const [permissionSet, setPermissionSet] = React.useState<string | undefined>(
    undefined
  );

  // Credentials
  const [credentials, setCredentials] = React.useState<
    AwsCredentials | undefined
  >(undefined);

  const [component, setComponent] = React.useState<
    ComponentCatalogEntry<any> | undefined
  >(undefined);

  // Ugly shit for custom data fetching
  const [selectedCustomData, setSelectedCustomData] = React.useState<
    CustomData | undefined
  >(undefined);
  const [customData, setCustomData] = React.useState<CustomData[]>([]);
  const [loadingCustomData, setLoadingCustomData] =
    React.useState<boolean>(true);
  // End ugly shit for custom data fetching

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.99)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
        }
      }, 100);

      setInputValue("");
    }
  }

  const getPlaceholder = () => {
    if (!credentialsProvider) {
      return "Select your credentials provider";
    } else if (!region) {
      return "Select a region";
    } else if (credentialsProvider === "sso" && !org) {
      return "Select an organisation";
    } else if (credentialsProvider === "sso" && !account) {
      return "Select an account";
    } else if (credentialsProvider === "sso" && !permissionSet) {
      return "Select a permission set";
    } else if (credentialsProvider === "credentials" && !credentials) {
      return "Enter your credentials";
    } else {
      return "Select a component";
    }
  };

  React.useEffect(() => {
    const fetchCustomData = async () => {
      try {
        if (!account || !permissionSet) {
          setCustomData([]);
          return;
        }

        if (!component) {
          setCustomData([]);
          return;
        }

        setLoadingCustomData(true);

        if (!component.resourceFetcher) {
          return;
        }

        const data = await component!.resourceFetcher(
          // TODO Need to construct an AWS client from the props
          {} as AWS,
          inputValue
        );

        setCustomData(data);
      } catch (err) {
      } finally {
        setLoadingCustomData(false);
      }
    };

    fetchCustomData();
  }, [account, permissionSet, inputValue, component]);

  useEffect(() => {
    const submitShape = () => {
      // const generatedResource = generateComponenEntry({
      //   type: component!.type,
      //   title: data.label,
      //   accessCard: {
      //     accountId: account!.accountId,
      //     permissionSet: permissionSet,
      //     region: region as AwsRegion,
      //   },
      //   customData: data,
      // });
      props.onAddShape({
        type: credentialsProvider as any,
        region: region as AwsRegion,
        sso:
          credentialsProvider === "sso"
            ? {
                permissionSet: permissionSet!,
                accountId: account!.accountId,
              }
            : undefined,
        accessKeyId:
          credentialsProvider === "credentials"
            ? credentials!.accessKeyId
            : undefined,
        cloudprovider: "aws",
        resources: customData.map((c) => ({
          resourceId: c.value,
        })),
        title: "",
      });
    };
    if (!component) return;
    if (component && !component.resourceFetcher) {
      submitShape();
    }
    if (customData) {
      submitShape();
    }
  }, [component, customData]);

  return (
    <div className="">
      <Command
        value={selectedValue}
        onValueChange={(v) => {
          setSelectedValue(v);
        }}
        ref={ref}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            bounce();
          }

          if (inputValue.length) {
            return;
          }

          if (e.key === "Backspace") {
            e.preventDefault();

            if (selectedCustomData) {
              setSelectedCustomData(undefined);
            } else if (component) {
              setComponent(undefined);
            } else if (region) {
              setRegion(undefined);
            } else if (permissionSet) {
              setPermissionSet(undefined);
            } else if (account) {
              setAccount(undefined);
            } else if (org) {
              setOrg(undefined);
            } else if (credentials) {
              setCredentials(undefined);
            } else {
              setCredentialsProvider(undefined);
            }
            bounce();
          }
        }}
        onWheel={(evt) => {
          evt.stopPropagation();
        }}
      >
        <div cmdk-header-wrapper="">
          <div cmdk-badges="">
            <div cmdk-badge="">Home</div>

            {/* {component && <div cmdk-badge="">{component.title}</div>} */}
            {credentialsProvider && (
              <div cmdk-badge="">{credentialsProvider}</div>
            )}

            {credentials && <div cmdk-badge="">Credentials</div>}

            {org && <div cmdk-badge="">{org.nickname || org.ssoStartUrl}</div>}

            {account && (
              <div cmdk-badge="">{account.name || account.accountId}</div>
            )}

            {region && <div cmdk-badge="">{region}</div>}
            {permissionSet && <div cmdk-badge="">{permissionSet}</div>}
          </div>

          <div cmdk-framer-header="">
            <SearchIcon />
            <Command.Input
              autoFocus
              value={inputValue}
              placeholder={getPlaceholder()}
              onValueChange={(value) => {
                setInputValue(value);
              }}
            />
          </div>
        </div>

        <div cmdk-list-wrapper="">
          <Command.List>
            <div cmdk-framer-items="">
              <div
                cmdk-framer-left=""
                className={region && !component ? "full" : ""}
              >
                {!credentialsProvider && (
                  <CredentialsProvider
                    setCredentialsProvider={setCredentialsProvider}
                  />
                )}

                {credentialsProvider === "sso" && !org && (
                  <Orgs
                    orgs={props.organisations}
                    setOrg={(org) => {
                      setOrg(org);
                      setInputValue("");
                    }}
                  />
                )}

                {credentialsProvider === "sso" && org && !account && (
                  <Accounts
                    orgs={props.organisations.filter(
                      (o) => o.ssoStartUrl === org!.ssoStartUrl
                    )}
                    setAccount={(acc) => {
                      setAccount(acc);
                      setInputValue("");
                    }}
                  />
                )}

                {credentialsProvider === "sso" && org && !permissionSet && (
                  <PermissionSets
                    account={account}
                    setPermissionSet={(ps) => {
                      setPermissionSet(ps);
                      setInputValue("");
                    }}
                  />
                )}

                {credentialsProvider === "credentials" && !credentials && (
                  <Credentials
                    credentials={props.credentials}
                    setCredentials={(x) => {
                      setCredentials(x);
                      setInputValue("");
                    }}
                  />
                )}

                {credentialsProvider &&
                  (credentials || permissionSet) &&
                  !region && (
                    <Regions
                      defaultRegion={
                        credentialsProvider === "sso"
                          ? org?.defaultRegion
                          : credentials?.defaultRegion
                      }
                      setRegion={(r) => {
                        setRegion(r);
                        setInputValue("");
                      }}
                    />
                  )}

                {region && !component && (
                  <Command.Group heading="Components">
                    {props.componentCatalog
                      .filter((c) => c.icon)
                      .map((c) => (
                        <Item
                          name={c.title}
                          value={c}
                          subtitle={c.subtitle}
                          icon={c.icon!}
                          key={c.type}
                          onSelect={() => {
                            setComponent(c);
                            setInputValue("");
                          }}
                        />
                      ))}
                  </Command.Group>
                )}

                {component && !selectedCustomData && (
                  <CustomData
                    data={customData}
                    setData={(data) => {
                      setSelectedCustomData(data);
                      setInputValue("");
                    }}
                  />
                )}

                {permissionSet && loadingCustomData && <p>Loading...</p>}
              </div>

              {/* Used for frames to the right */}
              {/* {region && !component && <hr cmdk-framer-separator="" />}
              { region && !component &&  <ExampleFrame selectedValue={selectedValue} display={!component} catalog={props.componentCatalog} /> } */}
            </div>
          </Command.List>
        </div>
      </Command>
    </div>
  );
};

const ExampleFrame = ({
  selectedValue,
  display,
  catalog,
}: {
  selectedValue: string;
  display: boolean;
  catalog: ComponentCatalogEntry<any>[];
}) => {
  if (!display) return null;
  if (!selectedValue) return null;

  return (
    <div cmdk-framer-right="">
      <div cmdk-framer-right-inner="">
        <h1 cmdk-group-heading="" cmdk-group-heading-right="">
          Example
        </h1>

        <div cmdk-example-frame="">
          {/* {catalog
            .filter((c) => c.title.toLowerCase() === selectedValue)
            .map((c) => {
              return (
                <div key={c.title}>
                  {c.render({
                    customData: c.sampleData()
                  })}
                </div>
              );
            })} */}
        </div>
      </div>
    </div>
  );
};

function Item({
  name,
  value,
  onSelect,
  subtitle,
  icon,
  disabled,
}: {
  name: string;
  value: any;
  onSelect: (val: string) => void;
  subtitle?: string;
  icon?: string;
  disabled?: boolean;
}) {
  return (
    <Command.Item
      value={name}
      onSelect={() => {
        onSelect(value);
      }}
      disabled={!!disabled}
    >
      {icon && (
        <div cmdk-framer-icon-wrapper="">
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
            style={{ height: 40, width: 40 }}
          />
        </div>
      )}
      <div cmdk-framer-item-meta="">
        {name}
        {subtitle && <span cmdk-framer-item-subtitle="">{subtitle}</span>}
      </div>
    </Command.Item>
  );
}

function Services({ setService }: { setService: (service: string) => void }) {
  return (
    <Command.Group heading={"Organisations"}>
      {[
        {
          name: "IOT Sitewise Metric",
          icon: "",
          subtitle: "An Alias",
        },
      ].map((s) => {
        return (
          <Item
            name={s.name}
            value={s.name}
            subtitle={s.subtitle}
            icon={s.icon}
            key={s.name}
            onSelect={() => {
              setService(s.name);
            }}
          />
        );
      })}
    </Command.Group>
  );
}

function Orgs({
  orgs,
  setOrg,
}: {
  orgs: Organisation[];
  setOrg: (org: Organisation) => void;
}) {
  return (
    <Command.Group heading={"Organisations"}>
      {orgs
        .map((o) => ({
          ...o,
          disabled: !o.authorisedUntil || +o.authorisedUntil < +new Date(),
          displayName: o.nickname || o.ssoStartUrl,
        }))
        .slice()
        .sort((a, b) =>
          a.disabled ? 10 : a.displayName.localeCompare(b.displayName)
        )
        .map((o) => {
          return (
            <Item
              name={
                `${o.nickname || o.ssoStartUrl}` +
                (o.disabled ? ` (not authenticated)` : "")
              }
              value={o}
              onSelect={() => setOrg(o)}
              disabled={o.disabled}
              key-={o.ssoStartUrl}
            />
          );
        })}
    </Command.Group>
  );
}

function Accounts({
  orgs,
  setAccount,
}: {
  orgs: Organisation[];
  setAccount: (acc: Account) => void;
}) {
  return (
    <>
      {orgs.map((o) => (
        <Command.Group
          heading={o.nickname || o.ssoStartUrl}
          key={o.ssoStartUrl}
        >
          {o.accounts
            .slice()
            .sort((a, b) => {
              if (a.name && b.name) {
                return a.name.localeCompare(b.name);
              } else if (!a.name) {
                return 10;
              } else if (!b.name) {
                return -10;
              } else {
                return a.accountId.localeCompare(b.accountId);
              }
            })
            .map((a) => (
              <Item
                name={a.name || a.accountId}
                value={a}
                onSelect={() => setAccount(a)}
                key-={a.accountId}
              />
            ))}
        </Command.Group>
      ))}
    </>
  );
}

function CredentialsProvider({
  setCredentialsProvider,
}: {
  setCredentialsProvider: (creds: string) => void;
}) {
  return (
    <Command.Group heading="Regions">
      {[
        { name: "IAM Identify Center (formerly SSO)", value: "sso" },
        { name: "Programmatic access key", value: "credentials" },
      ].map((r) => (
        <Item
          name={r.name}
          value={r}
          onSelect={() => setCredentialsProvider(r.value)}
          key={r.value}
        />
      ))}
    </Command.Group>
  );
}

function Credentials({
  credentials,
  setCredentials,
}: {
  credentials: AwsCredentials[];
  setCredentials: (accessKeyId: string) => void;
}) {
  return (
    <Command.Group heading="Credentials">
      {credentials.map((r) => (
        <Item
          name={r.nickname}
          value={r}
          onSelect={() => setCredentials(r)}
          key={r.value}
        />
      ))}
    </Command.Group>
  );
}

function Regions({
  setRegion,
  defaultRegion,
}: {
  setRegion: (acc: string) => void;
  defaultRegion?: string;
}) {
  return (
    <Command.Group heading="Regions">
      {regions
        .slice()
        .sort((a, b) => (a === defaultRegion ? -10 : a.localeCompare(b)))
        .map((r) => (
          <Item name={r} value={r} onSelect={() => setRegion(r)} key={r} />
        ))}
    </Command.Group>
  );
}

function PermissionSets({
  account,
  setPermissionSet,
}: {
  account?: Account;
  setPermissionSet: (acc: string) => void;
}) {
  if (!account) return null;

  return (
    <Command.Group heading="Permission sets">
      {account.roles
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((r) => (
          <Item
            name={r}
            value={r}
            onSelect={() => setPermissionSet(r)}
            key={r}
          />
        ))}
    </Command.Group>
  );
}

function CustomData({
  data,
  setData,
}: {
  data: CustomData[];
  setData: (data: CustomData) => void;
}) {
  return (
    <Command.Group heading="Resource">
      {data.map((d) => (
        <Item
          name={d.label}
          value={d}
          onSelect={() => setData(d)}
          key={d.label}
        />
      ))}
    </Command.Group>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
