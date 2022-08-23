import React from "react";
import "./root.css";
import Canvas from "../pages/canvas/canvas";
import AddResourceWatcher from "../components/modal/AddResourceWatcher";
import SideMenuWrapper from "../components/menu/SideMenuWrapper";
import AddOrganisationDetailWatcher from "../components/modal/AddOrganisationDetailWatcher";

class Root extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Canvas />
        <SideMenuWrapper />
        <AddResourceWatcher />
        <AddOrganisationDetailWatcher />
      </React.Fragment>
    );
  }
}

export default Root;
