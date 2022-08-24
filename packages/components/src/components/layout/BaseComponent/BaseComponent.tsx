import React, { useEffect, useMemo } from "react";
import { Rnd } from "react-rnd";
import { useMachine } from "@xstate/react";
import { AwsComponent, Component } from "../../../domain/core";
import {
  TbPlugConnected,
  TbPlugConnectedX,
  TbPlayerPlay,
  TbPlayerPause,
  TbInfoCircle,
} from "react-icons/tb";
import { centered, centeredRow, spacedRow } from "../../../utils/layoutUtils";
import Popover from "@cloudscape-design/components/popover";
import Button from "@cloudscape-design/components/button";
import TextContent from "@cloudscape-design/components/text-content";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import "../../../base.css";
import { createStreamMachine } from "../../../machines/dataFetcherMachine";
import ChildComponentWrapper from "./ChildComponentWrapper";

export const BASE_TAB_HGT = 40;
export const BASE_FOOTER_HGT = 20;

export interface ComponentStatus {
  authorisation: BaseComponentProps<unknown, unknown>["state"]["authorisation"];
  network?: BaseComponentProps<unknown, unknown>["state"]["network"];
  playing: Component["playing"];
}

export interface DataFetcher<T, U> {
  delay: number;
  initialData: T;
  fetch: () => Promise<U>;
  update: (current: T, update: U) => T;
}

export type AuthStatus = "authorized" | "expired";
export type NetworkStatus = "connected" | "disconnected";

export interface BaseComponentProps<T, U> {
  ports: {
    dataFetcher: DataFetcher<T, U>;
  };
  state: {
    component: Component;
    authorisation: AuthStatus;
    network?: NetworkStatus;
    scale?: number;
  };
  dispatch: {
    onAuthorise: () => void;
    onTogglePlay: () => void;
    onResize: (size: number[]) => void;
    onMove: (size: number[]) => void;
    onSelection: (selected: boolean) => void;
  };
  ContentComponent?: (data: any) => JSX.Element;
}

const BaseComponent = <T, U>({
  ports,
  state,
  dispatch,
  ContentComponent,
}: BaseComponentProps<T, U>) => {
  const [location, setLocation] = React.useState<number[] | undefined>();
  const [size, setSize] = React.useState<number[] | undefined>();

  // Create the machine to manage streaming data.
  const streamMachine = useMemo(
    () =>
      createStreamMachine<T, U>({
        dataFetcher: ports.dataFetcher,
        authorisation: state.authorisation,
        playing: state.component.playing,
      }),
    []
  );
  const [streamState, streamSend] = useMachine(streamMachine, {
    // @ts-ignore
    actions: {},
  });

  const { component: c } = state;

  const icon = c.def.icon;

  // We use the props to set the initial location and size but after that we ignore it and control
  // it with internal state to avoid any jitter. The side effects are dispatched to update for next open.
  useEffect(() => {
    setLocation(c.layout.location);
    setSize(c.layout.size);
  }, []);

  // Dispatch location side effect
  useEffect(() => {
    if (!location) return;

    dispatch.onMove(location);
  }, [location]);

  // Dispatch resize side effect
  useEffect(() => {
    if (!size) return;

    dispatch.onResize(size);
  }, [size]);

  useEffect(() => {
    if (state.component.playing) {
      streamSend("PLAYING");
    } else {
      streamSend("PAUSED");
    }
  }, [state.component.playing]);

  useEffect(() => {
    if (state.authorisation === "authorized") {
      streamSend("AUTHORISED");
    } else {
      streamSend("EXPIRED");
    }
  }, [state.authorisation]);

  if (!location || !size) return null;

  const hasData =
    streamState.context.data instanceof Array
      ? (streamState.context.data?.length || 0) > 0
      : !!streamState.context.data;

  return (
    <Rnd
      style={{
        borderColor: c.selected ? "#0972d3" : "black",
        borderWidth: 3,
        borderStyle: "solid",
        borderRadius: 5,
      }}
      scale={state.scale || 1}
      position={{ x: location[0], y: location[1] }}
      size={{ width: size[0], height: size[1] }}
      onDragStop={(e, d) => {
        setLocation([d.x, d.y]);
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setSize([parseFloat(ref.style.width), parseFloat(ref.style.height)]);
        setLocation([position.x, position.y]);
      }}
      cancel=".componentBody"
      allowAnyClick={false}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "white",
        }}
      >
        <div
          style={{
            height: BASE_TAB_HGT,
            width: "100%",
            borderBottomWidth: 3,
            borderBottomStyle: "solid",
            borderBottomColor: c.selected ? "#0972d3" : "black",
            ...spacedRow,
          }}
          onClick={(evt) => {
            evt.stopPropagation();
            dispatch.onSelection(!c.selected);
          }}
        >
          <div style={centeredRow}>
            {icon && (
              <img
                className="noselect"
                src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
                onDragStart={() => false}
                style={{ height: 40, width: 40, pointerEvents: "none" }}
                alt="Component icon"
              />
            )}
            <h3
              className="brand noselect"
              style={{ marginLeft: 8, color: "black" }}
            >
              {" "}
              {c.title}{" "}
            </h3>
          </div>

          <div style={{ ...centeredRow, marginRight: 8 }}>
            <Icons
              status={{
                authorisation: state.authorisation,
                network: state.network,
                playing: c.playing,
              }}
              component={c}
              togglePlay={() => dispatch.onTogglePlay()}
              authorise={() => dispatch.onAuthorise()}
            />
          </div>
        </div>

        <ChildComponentWrapper selected={state.component.selected}>
          {!hasData && <Placeholder state={state} />}

          {hasData && ContentComponent && (
            <ContentComponent data={streamState.context.data as any} />
          )}
        </ChildComponentWrapper>
      </div>
    </Rnd>
  );
};

const Icons = (props: {
  status: ComponentStatus;
  component: Component;
  togglePlay: () => void;
  authorise: () => void;
}) => {
  return (
    <div
      style={{ ...centeredRow, marginRight: 16 }}
      onClick={(evt) => evt.stopPropagation()}
    >
      <InformationIcon {...props} />

      <div style={{ width: 10 }}></div>

      <PlayAuthoriseWrapper status={props.status} authorise={props.authorise}>
        <PlayIcon {...props} />
      </PlayAuthoriseWrapper>

      <div style={{ width: 10 }}></div>

      <ConnectionIcon status={props.status} authorise={props.authorise} />
    </div>
  );
};

const InformationIcon = (props: {
  status: ComponentStatus;
  component: Component;
}) => {
  // Test for AWS Component as we only show for them
  const awsComponent = props.component as AwsComponent<any>;
  if (!awsComponent?.config?.accountId) return null;

  return (
    <Popover
      dismissButton={false}
      position="top"
      size="small"
      renderWithPortal={true}
      triggerType="custom"
      content={
        <TextContent>
          {awsComponent.def.name} in account {awsComponent.config.accountId} (
          {awsComponent.config.region}) using{" "}
          {awsComponent.config.permissionSet} permission set.
        </TextContent>
      }
    >
      <Pointer style={{ marginTop: 3 }}>
        <TbInfoCircle size={16} color="black" />
      </Pointer>
    </Popover>
  );
};

const PlayAuthoriseWrapper = ({
  status,
  authorise,
  children,
}: {
  status: ComponentStatus;
  authorise: () => void;
  children: React.ReactNode;
}) => {
  if (status.authorisation === "authorized")
    return <Pointer>{children}</Pointer>;

  return (
    <Popover
      dismissButton={false}
      position="top"
      size="small"
      triggerType="custom"
      renderWithPortal={true}
      content={
        <TextContent>
          Authorisation expired.
          <br />
          <br />
          <Button onClick={authorise}>Reauthorise</Button>
        </TextContent>
      }
    >
      <Pointer>{children}</Pointer>
    </Popover>
  );
};

const PlayIcon = ({
  status,
  togglePlay,
}: {
  status: ComponentStatus;
  togglePlay: () => void;
}) => {
  if (status.playing && status.authorisation === "authorized") {
    return <TbPlayerPause color="green" onClick={togglePlay} />;
  }
  if (status.playing && status.authorisation === "expired") {
    return <TbPlayerPause color="orange" onClick={togglePlay} />;
  } else {
    return <TbPlayerPlay color="black" onClick={togglePlay} />;
  }
};

const ConnectionIcon = ({
  status,
  authorise,
}: {
  status: ComponentStatus;
  authorise: () => void;
}) => {
  if (status.authorisation === "authorized") {
    return (
      <Popover
        dismissButton={false}
        position="top"
        size="small"
        triggerType="custom"
        renderWithPortal={true}
        // TODO Authorised until {ssoExpiryTime}
        // content={<StatusIndicator type="success">Authorised</StatusIndicator>}
        content={<StatusIndicator type="success">Authorised</StatusIndicator>}
      >
        <Pointer>
          <TbPlugConnected color="green" />
        </Pointer>
      </Popover>
    );
  } else {
    return (
      <Popover
        dismissButton={false}
        position="top"
        size="small"
        triggerType="custom"
        renderWithPortal={true}
        content={
          <TextContent>
            Authorisation expired.
            <br />
            <br />
            <Button onClick={authorise}>Reauthorise</Button>
          </TextContent>
        }
      >
        <Pointer>
          <TbPlugConnectedX color="orange" />
        </Pointer>
      </Popover>
    );
  }
};

const Pointer = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => (
  <div
    style={{
      ...(style || {}),
      cursor: "pointer",
    }}
  >
    {children}
  </div>
);

const Placeholder = <T, U>(props: Pick<BaseComponentProps<T, U>, "state">) => {
  return (
    <div style={{ ...centered, flex: 1 }}>
      <TextContent>
        {props.state.authorisation === "expired" && (
          <p>Authorisation has expired, refresh to view</p>
        )}
        {props.state.authorisation === "authorized" &&
          !props.state.component.playing && <p>Paused</p>}
        {props.state.authorisation === "authorized" &&
          props.state.component.playing && <p>Listening for updates...</p>}
      </TextContent>
    </div>
  );
};

export default BaseComponent;
