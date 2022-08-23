import React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";

export type SideMenuBasicProps = {};

export default ({}: SideMenuBasicProps) => {
  const [activeHref, setActiveHref] = React.useState(
    "#/parent-page/child-page1"
  );

  return (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: "#/", text: "Global AWS Access" }}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          setActiveHref(event.detail.href);
        }
      }}
      items={[
        {
          type: "section",
          text: "Sensive",
          items: [
            {
              type: "expandable-link-group",
              text: "Parent page",
              href: "#/parent-page",
              items: [
                {
                  type: "link",
                  text: "Child page 1",
                  href: "#/parent-page/child-page1",
                },
                {
                  type: "link",
                  text: "Child page 2",
                  href: "#/parent-page/child-page2",
                },
                {
                  type: "link",
                  text: "Child page 3",
                  href: "#/parent-page/child-page3",
                },
              ],
            },
            {
              type: "expandable-link-group",
              text: "Parent page",
              href: "#/parent-page",
              items: [
                {
                  type: "link",
                  text: "Child page 1",
                  href: "#/parent-page/child-page1",
                },
                {
                  type: "link",
                  text: "Child page 2",
                  href: "#/parent-page/child-page2",
                },
                {
                  type: "link",
                  text: "Child page 3",
                  href: "#/parent-page/child-page3",
                },
              ],
            },
            {
              type: "expandable-link-group",
              text: "Parent page",
              href: "#/parent-page",
              items: [
                {
                  type: "link",
                  text: "Child page 1",
                  href: "#/parent-page/child-page1",
                },
                {
                  type: "link",
                  text: "Child page 2",
                  href: "#/parent-page/child-page2",
                },
                {
                  type: "link",
                  text: "Child page 3",
                  href: "#/parent-page/child-page3",
                },
              ],
            },
          ],
        },
        {
          type: "section",
          text: "Section 2",
          items: [
            {
              type: "link",
              text: "Page 7",
              href: "#/page7",
            },
            {
              type: "link",
              text: "Page 8",
              href: "#/page8",
            },
            {
              type: "link",
              text: "Page 9",
              href: "#/page9",
            },
          ],
        },
      ]}
    />
  );
};
