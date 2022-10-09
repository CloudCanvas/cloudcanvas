import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { Divider } from "../../Primitives/Divider";
import { DMContent } from "../../Primitives/DropdownMenu";
import { RowButton } from "../../Primitives/RowButton";
import { SmallIcon } from "../../Primitives/SmallIcon";
import { ToolButton } from "../../Primitives/ToolButton";
import styled from "stitches.config";

// import { PageOptionsDialog } from '../PageOptionsDialog'

// const sortedSelector = (s: TDSnapshot) =>
//   Object.values(s.document.pages).sort((a, b) => (a.childIndex || 0) - (b.childIndex || 0))

// const currentPageNameSelector = (s: TDSnapshot) => s.document.pages[s.appState.currentPageId].name

// const currentPageIdSelector = (s: TDSnapshot) => s.document.pages[s.appState.currentPageId].id

export function PageMenu() {
  const rIsOpen = React.useRef(false);

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (rIsOpen.current !== isOpen) {
      rIsOpen.current = isOpen;
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (rIsOpen.current !== isOpen) {
        setIsOpen(isOpen);
      }
    },
    [setIsOpen]
  );
  // TODO Pages
  // const currentPageName = app.useStore(currentPageNameSelector)
  const currentPageName = "Page 1";

  return (
    <DropdownMenu.Root dir="ltr" open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger dir="ltr" asChild id="TD-Page">
        <ToolButton variant="text">{currentPageName}</ToolButton>
      </DropdownMenu.Trigger>
      <DMContent variant="menu" align="start" sideOffset={4}>
        {isOpen && <PageMenuContent onClose={handleClose} />}
      </DMContent>
    </DropdownMenu.Root>
  );
}

function PageMenuContent({ onClose }: { onClose: () => void }) {
  // TODO Pages
  // const sortedPages = app.useStore(sortedSelector)
  // const currentPageId = app.useStore(currentPageIdSelector)

  const [dragId, setDragId] = React.useState<null | string>(null);

  const [dropIndex, setDropIndex] = React.useState<null | number>(null);

  // const handleDragStart = React.useCallback((ev: React.DragEvent<HTMLDivElement>) => {
  //   setDragId(ev.currentTarget.id)
  //   setDropIndex(sortedPages.findIndex((p) => p.id === ev.currentTarget.id))
  //   ev.dataTransfer.effectAllowed = 'move'
  // }, [])

  // const handleDrag = React.useCallback(
  //   (ev: React.DragEvent<HTMLDivElement>) => {
  //     ev.preventDefault()

  //     let dropIndex = sortedPages.findIndex((p) => p.id === ev.currentTarget.id)

  //     const rect = ev.currentTarget.getBoundingClientRect()
  //     const ny = (ev.clientY - rect.top) / rect.height

  //     dropIndex = ny < 0.5 ? dropIndex : dropIndex + 1

  //     setDropIndex(dropIndex)
  //   },
  //   [dragId, sortedPages]
  // )

  // const handleDrop = React.useCallback(() => {
  //   if (dragId !== null && dropIndex !== null) {
  //     app.movePage(dragId, dropIndex)
  //   }

  //   setDragId(null)
  //   setDropIndex(null)
  // }, [dragId, dropIndex])

  return (
    <>
      <DropdownMenu.RadioGroup dir="ltr" value={"Page 1"}>
        {/* // TODO Pages */}
        {/* {sortedPages.map((page, i) => ( */}
        {["Page 1"].map((page, i) => (
          <ButtonWithOptions
            // key={page.id}
            key="page"
            isDropAbove={i === dropIndex && i === 0}
            isDropBelow={dropIndex !== null && i === dropIndex - 1}
          >
            <DropdownMenu.RadioItem
              // title={page.name || defaultPageName}
              title="Page 1"
              value="Page 1"
              // key={page.id}
              // id={page.id}
              asChild
              // onDragOver={handleDrag}
              // onDragStart={handleDragStart}
              // onDrop={handleDrop}
              // draggable={true}
              draggable={false}
            >
              <PageButton>
                {/* <span id={page.id}>{page.name || defaultPageName}</span> */}
                <span>Page 1</span>
                <DropdownMenu.ItemIndicator>
                  <SmallIcon>
                    <CheckIcon />
                  </SmallIcon>
                </DropdownMenu.ItemIndicator>
              </PageButton>
            </DropdownMenu.RadioItem>
            {/* <PageOptionsDialog page={page} onClose={onClose} /> */}
          </ButtonWithOptions>
        ))}
      </DropdownMenu.RadioGroup>
      <Divider />
      {/* <DropdownMenu.Item onSelect={handleCreatePage} asChild>
        <RowButton>
          <span>
            <FormattedMessage id="create.page" />
          </span>
          <SmallIcon>
            <PlusIcon />
          </SmallIcon>
        </RowButton>
      </DropdownMenu.Item> */}
    </>
  );
}

const ButtonWithOptions = styled("div", {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gridAutoFlow: "column",
  margin: 0,

  '& > *[data-shy="true"]': {
    opacity: 0,
  },

  '&:hover > *[data-shy="true"]': {
    opacity: 1,
  },

  variants: {
    isDropAbove: {
      true: {
        "&::after": {
          content: "",
          display: "block",
          position: "absolute",
          top: 0,
          width: "100%",
          height: "1px",
          backgroundColor: "$selected",
          zIndex: 999,
          pointerEvents: "none",
        },
      },
    },
    isDropBelow: {
      true: {
        "&::after": {
          content: "",
          display: "block",
          position: "absolute",
          width: "100%",
          height: "1px",
          top: "100%",
          backgroundColor: "$selected",
          zIndex: 999,
          pointerEvents: "none",
        },
      },
    },
  },
});

export const PageButton = styled(RowButton, {
  minWidth: 128,
});
