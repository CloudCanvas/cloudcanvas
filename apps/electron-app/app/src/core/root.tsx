import React from "react";
import "./root.css";
import Canvas from "../pages/canvas/canvas";
import AddResourceWatcher from "../components/modal/AddResourceWatcher";
import SideMenuWrapper from "../components/menu/SideMenuWrapper";
import AddOrganisationDetailWatcher from "../components/modal/AddOrganisationDetailWatcher";
import AnnotationContext from "@cloudscape-design/components/annotation-context";
import { Link } from "@cloudscape-design/components";
import WelcomeCenter from "../components/welcome/WelcomeCenter";

class Root extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Canvas />
        <SideMenuWrapper />
        <WelcomeCenter />
        <AddResourceWatcher />
        <AddOrganisationDetailWatcher />
      </React.Fragment>
    );
  }
}

export default Root;
