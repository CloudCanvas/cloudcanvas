import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import Root from "./core/root";
import "bulma/css/bulma.css";
import "@cloudscape-design/global-styles/index.css";
import "cloudcanvas-components/lib/index.css";

const container = document.getElementById("target");
const root = createRoot(container!);
root.render(
  <Suspense fallback="loading">
    <Root></Root>
  </Suspense>
);
