import { TitleLinks } from "./components/TitleLinks";
import { Toolbar } from "./components/Toolbar";
import { shapeUtils } from "./shapes";
import { machine } from "./state/machine";
import "./styles.css";
import { useStateDesigner } from "@state-designer/react";
import {
  Renderer,
  TLBounds,
  TLKeyboardEventHandler,
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLWheelEventHandler,
} from "@tldraw/core";
import { AwsApi } from "awsApi";
import "cloudcanvas-components/lib/index.css";
import { AwsRegion } from "cloudcanvas-types";
import { TopPanel } from "components/TopPanel";
import * as React from "react";
import { Api } from "state/api";
import { Account } from "state/constants";
import styled from "stitches.config";
import { ContainerContext } from "useCoreApp";

declare const window: Window & { api: Api };

const onHoverShape: TLPointerEventHandler = (info, e) => {
  machine.send("HOVERED_SHAPE", info);
};

const onZoom: TLWheelEventHandler = (info, _e) => {
  if (info.delta[2] > 0) {
    machine.send("ZOOMED_OUT", info);
  } else if (info.delta[2] < 0) {
    machine.send("ZOOMED_IN", info);
  }
};

const onUnhoverShape: TLPointerEventHandler = (info, e) => {
  machine.send("UNHOVERED_SHAPE", info);
};

const onPointShape: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_SHAPE", info);
};

const onEditShape: TLPointerEventHandler = (info, e) => {
  machine.send("EDITING_SHAPE", info);
};

const onPointCanvas: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_CANVAS", info);
};

const onPointBounds: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_BOUNDS", info);
};

const onPointHandle: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_HANDLE", info);
};

const onPointerDown: TLPointerEventHandler = (info, e) => {
  machine.send("STARTED_POINTING", info);
};

const onPointerUp: TLPointerEventHandler = (info, e) => {
  machine.send("STOPPED_POINTING", info);
};

const onPointerMove: TLPointerEventHandler = (info, e) => {
  machine.send("MOVED_POINTER", info);
};

const onPan: TLWheelEventHandler = (info, e) => {
  machine.send("PANNED", info);
};

const onPinchStart: TLPinchEventHandler = (info, e) => {
  machine.send("STARTED_PINCHING", info);
};

const onPinch: TLPinchEventHandler = (info, e) => {
  machine.send("PINCHED", info);
};

const onPinchEnd: TLPinchEventHandler = (info, e) => {
  machine.send("STOPPED_PINCHING", info);
};

const onPointBoundsHandle: TLPinchEventHandler = (info, e) => {
  machine.send("POINTED_BOUNDS_HANDLE", info);
};

const onBoundsChange = (bounds: TLBounds) => {
  machine.send("RESIZED", { bounds });
};

const onCancel = () => {
  machine.send("CANCELLED");
};

const onKeyDown: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "Alt":
    case "Meta":
    case "Control":
    case "Shift": {
      machine.send("TOGGLED_MODIFIER", info);
      break;
    }
    case "Backspace": {
      machine.send("DELETED", info);
      break;
    }
    case "Escape": {
      onCancel();
      break;
    }
    case "0": {
      machine.send("ZOOMED_TO_ACTUAL", info);
      break;
    }
    case "1": {
      machine.send("ZOOMED_TO_FIT", info);
      break;
    }
    case "2": {
      machine.send("ZOOMED_TO_SELECTION", info);
      break;
    }
    case "=": {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault();
        machine.send("ZOOMED_IN", info);
      }
      break;
    }
    case "-": {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault();
        machine.send("ZOOMED_OUT", info);
      }
      break;
    }
    case "s": {
      machine.send("SELECTED_TOOL", { name: "select" });
      break;
    }
    case "c": {
      if (info.metaKey || info.ctrlKey) {
        machine.send("COPY");
      } else {
        machine.send("SELECTED_TOOL", { name: "cloud" });
      }
      break;
    }
    case "v": {
      if (info.metaKey || info.ctrlKey) {
        machine.send("PASTE");
      } else {
        machine.send("SELECTED_TOOL", { name: "select" });
      }
      break;
    }
    case "r":
    case "b": {
      machine.send("SELECTED_TOOL", { name: "box" });
      break;
    }
    case "d": {
      machine.send("SELECTED_TOOL", { name: "pencil" });
      break;
    }
    case "e": {
      machine.send("SELECTED_TOOL", { name: "eraser" });
      break;
    }
    case "a": {
      if (info.metaKey || info.ctrlKey) {
        machine.send("SELECTED_ALL");
        e.preventDefault();
      } else {
        machine.send("SELECTED_TOOL", { name: "arrow" });
      }
      break;
    }
    case "z": {
      if (info.metaKey || info.ctrlKey) {
        if (info.shiftKey) {
          machine.send("REDO");
        } else {
          machine.send("UNDO");
        }
      }
      break;
    }
  }
};

const onKeyUp: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "Alt":
    case "Meta":
    case "Control":
    case "Shift": {
      machine.send("TOGGLED_MODIFIER", info);
      break;
    }
  }
};

interface AppProps {
  onMount?: (api: Api) => void;
}

export default function App({ onMount }: AppProps) {
  const appState = useStateDesigner(machine);
  const rWrapper = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const api = new Api(appState, new AwsApi());
    onMount?.(api);
    window["api"] = api;
  }, []);

  React.useEffect(() => {
    // Get the query params
    const params = new URLSearchParams(window.location.search);
    const accessKeyId = params.get("accessKeyId");
    const secretAccessKey = params.get("secretAccessKey");
    const sessionToken = params.get("sessionToken");
    const region = params.get("region");
    const name = params.get("name");

    // Clear query parms
    window.history.replaceState({}, document.title, "/");

    if (accessKeyId && secretAccessKey && region) {
      (async () => {
        const accountId = await window.api.trySaveCredentials({
          accessKeyId,
          secretAccessKey,
          sessionToken: sessionToken || undefined,
        });

        const accountToAdd: Account = {
          name: name || accountId,
          active: true,
          regions: [region],
          accountId,
        };

        machine.send("ADD_ACCOUNT", { account: accountToAdd });

        window.alert("Account detected, indexing...");

        await window.api.indexAccount(accountId, region as AwsRegion);
      })();
    }
  }, []);

  const hideBounds = appState.isInAny(
    "transformingSelection",
    "translating",
    "creating"
  );

  const firstShapeId = appState.data.pageState.selectedIds[0];
  const firstShape = firstShapeId
    ? appState.data.page.shapes[firstShapeId]
    : null;
  const hideResizeHandles = firstShape
    ? appState.data.pageState.selectedIds.length === 1 &&
      shapeUtils[firstShape.type].hideResizeHandles
    : false;

  return (
    <AppContainer ref={rWrapper}>
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={appState.data.page} // Required
        pageState={appState.data.pageState} // Required
        performanceMode={appState.data.performanceMode}
        meta={appState.data.meta}
        snapLines={appState.data.overlays.snapLines}
        onPointShape={onPointShape}
        onDoubleClickShape={onEditShape}
        onPointBounds={onPointBounds}
        onPointCanvas={onPointCanvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onHoverShape={onHoverShape}
        onZoom={onZoom}
        onUnhoverShape={onUnhoverShape}
        onPointBoundsHandle={onPointBoundsHandle}
        onPointHandle={onPointHandle}
        onPan={onPan}
        onPinchStart={onPinchStart}
        onPinchEnd={onPinchEnd}
        onPinch={onPinch}
        onPointerUp={onPointerUp}
        onBoundsChange={onBoundsChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        hideBounds={hideBounds}
        hideHandles={hideBounds}
        hideResizeHandles={hideResizeHandles}
        hideIndicators={hideBounds}
        hideBindingHandles={true}
      />
      <ContainerContext.Provider value={rWrapper}>
        <div ref={rWrapper}>
          <TopPanel readOnly={false} showPages={true} />
          <Toolbar activeStates={appState.active} lastEvent={appState.log[0]} />
          <TitleLinks />
        </div>
      </ContainerContext.Provider>
    </AppContainer>
  );
}

const AppContainer = styled("div", {
  position: "fixed",
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
  width: "100%",
  height: "100%",
  zIndex: 101,
});
