import React, { useEffect, useRef } from "react";
import "./BaseComponent.scss";
import { Rnd } from "react-rnd";
import { AwsComponent } from "@cloudcanvas/types";
import {
  TbPlugConnected,
  TbPlugConnectedX,
  TbPlayerPlay,
  TbPlayerPause,
  TbInfoCircle,
} from "react-icons/tb";
import { centeredRow, spacedRow } from "../../../utils/layoutUtils";
import Popover from "@cloudscape-design/components/popover";
import Button from "@cloudscape-design/components/button";
import TextContent from "@cloudscape-design/components/text-content";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import "../../../base.css";
import ChildComponentWrapper from "./ChildComponentWrapper";
import { componentCatalog } from "../../../domain";

export const BASE_TAB_HGT = 40;
export const BASE_FOOTER_HGT = 20;

export interface ComponentStatus {
  authorisation: BaseComponentProps["state"]["authorisation"];
  network?: BaseComponentProps["state"]["network"];
  playing: boolean;
}

export type AuthStatus = "authorized" | "expired";
export type NetworkStatus = "connected" | "disconnected";

export interface BaseComponentProps {
  state: {
    component: AwsComponent<unknown, unknown>;
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
  children: React.ReactNode;
}

const BaseComponent = ({ state, dispatch, children }: BaseComponentProps) => {
  const { component: c } = state;

  const dragTime = useRef(+new Date());
  const hasDragged = useRef(false);

  const [location, setLocation] = React.useState<number[] | undefined>();
  const [size, setSize] = React.useState<number[] | undefined>();

  const catalogEntry = componentCatalog.find(
    (c) => c.type === state.component.type
  )!;

  const icon = catalogEntry.icon;

  // We use the props to set the initial location and size but after that we ignore it and control
  // it with internal state to avoid any jitter. The side effects are dispatched to update for next open.
  useEffect(() => {
    setLocation(c.state.layout.location);
    setSize(c.state.layout.size);
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

  if (!location || !size) return null;

  return (
    <Rnd
      className={`base-component lined thick ${
        c.state.selected ? "selected" : "unselected"
      }`}
      scale={state.scale || 1}
      position={{ x: location[0], y: location[1] }}
      size={{ width: size[0], height: size[1] }}
      onDragStop={(e, d) => {
        setLocation([d.x, d.y]);

        // onDragStop always happens even if no drag happened
        // The user may have dragged and waited before letting go so
        // we need to know if there was a drag to set the time and then not trigger a click event
        if (hasDragged.current) {
          dragTime.current = +new Date();
        }
        hasDragged.current = false;
      }}
      onDrag={(e, data) => {
        if (Math.max(Math.abs(data.deltaX), Math.abs(data.deltaY)) > 5) {
          hasDragged.current = true;
        }
        dragTime.current = +new Date();
      }}
      onResizeStop={(e, _direction, ref, _delta, position) => {
        setSize([parseFloat(ref.style.width), parseFloat(ref.style.height)]);
        setLocation([position.x, position.y]);
        // e.stopPropagation();
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
            borderBottomColor: c.state.selected ? "#0972d3" : "black",
            ...spacedRow,
          }}
          onClick={(evt) => {
            evt.stopPropagation();

            // Only send click if a drag did no just hapen
            if (Math.abs(+new Date() - dragTime.current) > 50) {
              dispatch.onSelection(!c.state.selected);
            }
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
                playing: c.state.playing,
              }}
              component={c}
              togglePlay={() => dispatch.onTogglePlay()}
              authorise={() => dispatch.onAuthorise()}
            />
          </div>
        </div>

        <ChildComponentWrapper selected={state.component.state.selected}>
          {children}
        </ChildComponentWrapper>
      </div>
    </Rnd>
  );
};

const Icons = (props: {
  status: ComponentStatus;
  component: AwsComponent<unknown, unknown>;
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
  component: AwsComponent<unknown, unknown>;
}) => {
  // Test for AWS Component as we only show for them
  if (!props.component?.config?.accountId) return null;

  const catalogEntry = componentCatalog.find(
    (c) => c.type === props.component.type
  );

  return (
    <Popover
      dismissButton={false}
      position="top"
      size="small"
      renderWithPortal={true}
      triggerType="custom"
      content={
        <TextContent>
          {catalogEntry?.title} in account {props.component.config.accountId} (
          {props.component.config.region}) using{" "}
          {props.component.config.permissionSet} permission set.
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
    return <TbPlayerPlay color="green" onClick={togglePlay} />;
  }
  if (status.playing && status.authorisation === "expired") {
    return <TbPlayerPlay color="orange" onClick={togglePlay} />;
  } else {
    return <TbPlayerPause color="black" onClick={togglePlay} />;
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

export default BaseComponent;
