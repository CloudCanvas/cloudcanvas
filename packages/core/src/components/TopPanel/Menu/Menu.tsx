import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { supported } from "browser-fs-access";
import * as React from "react";
import { Divider } from "../../Primitives/Divider";
import {
  DMContent,
  DMItem,
  DMSubMenu,
  DMTriggerIcon,
} from "../../Primitives/DropdownMenu";
import { preventEvent } from "../../preventEvent";

interface MenuProps {
  readOnly: boolean;
}

export const Menu = React.memo(function Menu({ readOnly }: MenuProps) {
  const [openDialog, setOpenDialog] = React.useState(false);

  const [_, setForce] = React.useState(0);

  React.useEffect(() => setForce(1), []);

  // const { onNewProject, onOpenProject, onSaveProject, onSaveProjectAs } = useFileSystemHandlers()

  const handleSaveProjectAs = React.useCallback(() => {
    window.alert("Coming soon");
  }, []);

  const handleCopySVG = React.useCallback(() => {
    // app.copyImage(TDExportType.SVG, { scale: 1, quality: 1, transparentBackground: false })
    window.alert("Coming soon");
  }, []);

  const handleExportPNG = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleExportJPG = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleExportWEBP = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleExportSVG = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleCopyJSON = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleExportJSON = React.useCallback(async () => {
    window.alert("Coming soon");
  }, []);

  const handleCut = React.useCallback(() => {
    // app.cut()
    // TODO
  }, []);

  const handleCopy = React.useCallback(() => {
    // app.copy()
    // TODO
  }, []);

  const handlePaste = React.useCallback(() => {
    // app.paste()
    // TODO
  }, []);

  const handleSelectAll = React.useCallback(() => {
    // app.selectAll()
    // TODO
  }, []);

  const handleSelectNone = React.useCallback(() => {
    // app.selectNone()
    // TODO
  }, []);

  const handleZoomTo100 = React.useCallback(() => {
    // app.zoomTo(1)
    // TODO
  }, []);

  const showFileMenu = true;

  // const hasSelection = numberOfSelectedIds > 0

  return (
    <>
      <DropdownMenu.Root dir="ltr">
        <DMTriggerIcon id="TD-MenuIcon">
          <HamburgerMenuIcon />
        </DMTriggerIcon>
        <DMContent
          variant="menu"
          id="TD-Menu"
          side="bottom"
          align="start"
          sideOffset={4}
          alignOffset={4}
        >
          {showFileMenu && (
            <DMSubMenu label={"File"} id="TD-MenuItem-File">
              <DMItem kbd="#S" id="TD-MenuItem-File-Save">
                Save
              </DMItem>

              <DMItem
                onClick={handleSaveProjectAs}
                kbd="#⇧S"
                id="TD-MenuItem-File-Save_As"
              >
                Save as
              </DMItem>
            </DMSubMenu>
          )}
          <DMSubMenu label={"Edit"} id="TD-MenuItem-Edit">
            <DMItem
              onSelect={preventEvent}
              // disabled={!hasSelection || readOnly}
              onClick={handleCut}
              kbd="#X"
              id="TD-MenuItem-Edit-Cut"
            >
              Cut
            </DMItem>
            <DMItem
              onSelect={preventEvent}
              // disabled={!hasSelection}
              onClick={handleCopy}
              kbd="#C"
              id="TD-MenuItem-Edit-Copy"
            >
              Copy
            </DMItem>
            <DMItem
              onSelect={preventEvent}
              onClick={handlePaste}
              kbd="#V"
              id="TD-MenuItem-Edit-Paste"
            >
              Paste
            </DMItem>
            <Divider />
            <DMSubMenu label={"Copy as"} size="small" id="TD-MenuItem-Copy-As">
              <DMItem onClick={handleCopySVG} id="TD-MenuItem-Copy-as-SVG">
                SVG
              </DMItem>
              <DMItem onClick={handleCopyJSON} id="TD-MenuItem-Copy_as_JSON">
                JSON
              </DMItem>
            </DMSubMenu>
            <DMSubMenu label={"Export as"} size="small" id="TD-MenuItem-Export">
              <DMItem onClick={handleExportSVG} id="TD-MenuItem-Export-SVG">
                SVG
              </DMItem>
              <DMItem onClick={handleExportPNG} id="TD-MenuItem-Export-PNG">
                PNG
              </DMItem>
              <DMItem onClick={handleExportJPG} id="TD-MenuItem-Export-JPG">
                JPG
              </DMItem>
              <DMItem onClick={handleExportWEBP} id="TD-MenuItem-Export-WEBP">
                WEBP
              </DMItem>
              <DMItem onClick={handleExportJSON} id="TD-MenuItem-Export-JSON">
                JSON
              </DMItem>
            </DMSubMenu>

            <Divider />
            <DMItem
              onSelect={preventEvent}
              onClick={handleSelectAll}
              kbd="#A"
              id="TD-MenuItem-Select_All"
            >
              Select all
            </DMItem>
            <DMItem
              onSelect={preventEvent}
              // disabled={!hasSelection}
              onClick={handleSelectNone}
              id="TD-MenuItem-Select_None"
            >
              Select none
            </DMItem>
            <Divider />
          </DMSubMenu>
          <DMSubMenu label={"View"} id="TD-MenuItem-Edit">
            {/* <DMItem
              onSelect={preventEvent}
              onClick={app.zoomIn}
              kbd="#+"
              id="TD-MenuItem-View-ZoomIn"
            >
              <FormattedMessage id="zoom.in" />
            </DMItem>
            <DMItem
              onSelect={preventEvent}
              onClick={app.zoomOut}
              kbd="#-"
              id="TD-MenuItem-View-ZoomOut"
            >
              <FormattedMessage id="zoom.out" />
            </DMItem> */}
            <DMItem
              onSelect={preventEvent}
              onClick={handleZoomTo100}
              kbd="⇧+0"
              id="TD-MenuItem-View-ZoomTo100"
            >
              Zoom to 100%
            </DMItem>
          </DMSubMenu>
          <Divider />
        </DMContent>
      </DropdownMenu.Root>
    </>
  );
});
