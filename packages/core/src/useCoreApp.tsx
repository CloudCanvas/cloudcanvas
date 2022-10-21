import * as React from "react";

const useForceUpdate = () => {
  const [_state, setState] = React.useState(0);
  React.useEffect(() => setState(1));
};

export const ContainerContext = React.createContext(
  {} as React.RefObject<HTMLDivElement>
);

export function useContainer() {
  const context = React.useContext(ContainerContext);
  useForceUpdate();

  return context;
}
