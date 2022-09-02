import React from "react";
import { AwsStore } from "./AwsStore";
import { aws, ssoBridge } from "../entrypoints/aws";
import { ComponentStore } from "./ComponentStore";
import { LayoutStore } from "./LayoutStore";
import { clipboard } from "../entrypoints/clipboard";
import { ComponentRendererStore } from "./ComponentRendererStore";
import { WelcomeStore } from "./WelcomeStore";

const globalStores = {
  aws: new AwsStore(ssoBridge, clipboard),
  component: new ComponentStore(),
  layout: new LayoutStore(),
};

const domainStores = {
  componentRenderer: new ComponentRendererStore(
    globalStores.aws,
    globalStores.component,
    globalStores.layout
  ),
  welcome: new WelcomeStore(),
};

export const useStores = () => React.useContext(storesContext);

export const storesContext = React.createContext({
  ...globalStores,
  ...domainStores,
});

export const StoreProvider = ({ children }: { children: any }) => {
  const store = useStores();
  return (
    <storesContext.Provider value={store}>{children}</storesContext.Provider>
  );
};
