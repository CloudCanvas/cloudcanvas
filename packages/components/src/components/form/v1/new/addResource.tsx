import { componentCatalog } from "../../../../domain";
import { regions } from "../../../../domain/aws";
import "../../../base.css";
import "./addResource.scss";
import {
  AccessCard,
  Account,
  AwsComponent,
  AwsRegion,
  Organisation,
} from "cloudcanvas-types";
import { Command } from "cmdk";
import React from "react";

export type CustomData = { label: string; value: any };

export type AddResourceProps = {
  organisations: Organisation[];
  activeAccount?: Account;
  dataFetcher: (
    component: typeof componentCatalog[number],
    access: AccessCard,
    prefix?: string
  ) => Promise<CustomData[]>;
  onAddComponent: (component: AwsComponent<unknown, unknown>) => void;
};

export default (props: AddResourceProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const [component, setComponent] = React.useState<
    typeof componentCatalog[number] | undefined
  >(undefined);

  const [org, setOrg] = React.useState<Organisation | undefined>(undefined);

  const [account, setAccount] = React.useState<Account | undefined>(undefined);

  const [region, setRegion] = React.useState<string | undefined>(undefined);

  const [permissionSet, setPermissionSet] = React.useState<string | undefined>(
    undefined
  );

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
    if (permissionSet) {
      return "Select your resource";
    } else if (region) {
      return "Select a permission set";
    } else if (account) {
      return "Select a region";
    } else if (org) {
      return "Select an account";
    } else if (component) {
      return "Select an organisation";
    } else {
      return "Find components for popular AWS Services...";
    }
  };

  React.useEffect(() => {
    if (!permissionSet) return;

    const fetchCustomData = async () => {
      try {
        if (!account || !permissionSet) {
          setCustomData([]);
          return;
        }

        setLoadingCustomData(true);

        const data = await props.dataFetcher(
          component!,
          {
            accountId: account.accountId,
            permissionSet: permissionSet,
            region: region as AwsRegion,
          },
          inputValue
        );

        setCustomData(data);
      } catch (err) {
      } finally {
        setLoadingCustomData(false);
      }
    };

    fetchCustomData();
  }, [component, account?.accountId, region, permissionSet, inputValue]);

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

          if (!component || inputValue.length) {
            return;
          }

          if (e.key === "Backspace") {
            e.preventDefault();
            if (selectedCustomData) {
              setSelectedCustomData(undefined);
            } else if (permissionSet) {
              setPermissionSet(undefined);
            } else if (region) {
              setRegion(undefined);
            } else if (account) {
              setAccount(undefined);
            } else if (org) {
              setOrg(undefined);
            } else if (component) {
              setComponent(undefined);
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
            {component && <div cmdk-badge="">{component.title}</div>}
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
              <div cmdk-framer-left="" className={component ? "full" : ""}>
                {!component && (
                  <Command.Group heading="Components">
                    {componentCatalog
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

                {component && !org && (
                  <Orgs
                    orgs={props.organisations}
                    setOrg={(org) => {
                      setOrg(org);
                      setInputValue("");
                    }}
                  />
                )}

                {org && !account && (
                  <Accounts
                    orgs={props.organisations.filter(
                      (o) => o.ssoStartUrl === org.ssoStartUrl
                    )}
                    setAccount={(acc) => {
                      setAccount(acc);
                      setInputValue("");
                    }}
                  />
                )}

                {account && !region && (
                  <Regions
                    defaultRegion={org?.defaultRegion}
                    setRegion={(r) => {
                      setRegion(r);
                      setInputValue("");
                    }}
                  />
                )}

                {region && !permissionSet && (
                  <PermissionSets
                    account={account}
                    setPermissionSet={(ps) => {
                      setPermissionSet(ps);
                      setInputValue("");
                    }}
                  />
                )}

                {permissionSet && !selectedCustomData && (
                  <CustomData
                    data={customData}
                    setData={(data) => {
                      setSelectedCustomData(data);
                      setInputValue("");

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

                      // props.onAddComponent(generatedResource);
                    }}
                  />
                )}
                {permissionSet && loadingCustomData && <p>Loading...</p>}
              </div>

              {!component && <hr cmdk-framer-separator="" />}

              <ExampleFrame
                selectedValue={selectedValue}
                display={!component}
              />
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
}: {
  selectedValue: string;
  display: boolean;
}) => {
  if (!display) return null;

  const someSelected = componentCatalog.some(
    (c) => c.title.toLowerCase() === selectedValue
  );

  if (!someSelected) {
    return <div cmdk-framer-right=""></div>;
  }
  return (
    <div cmdk-framer-right="">
      <div cmdk-framer-right-inner="">
        <h1 cmdk-group-heading="" cmdk-group-heading-right="">
          Example
        </h1>

        <div cmdk-example-frame="">
          {componentCatalog
            .filter((c) => c.title.toLowerCase() === selectedValue)
            .map((c) => {
              return (
                <div key={c.title}>
                  {/* {c.render({
                    awsClient: {} as any,
                    playing: true,
                    setSelected: () => {},
                    authorised: true,
                    selected: false,
                    customProps: {} as any,
                    dataFetcher: {
                      initialData: c.sampleData(),
                      fetch: async () => {
                        return c.sampleUpdate();
                      },
                      reduce: (current: any, update: any) => {
                        return [...current, ...update];
                      },
                    },
                  })} */}
                </div>
              );
            })}
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
