import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStores } from "../../store";

export default observer(() => {
  const { component, layout } = useStores();

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      const isCtrled = e.ctrlKey || e.metaKey;
      const isCopy = e.key === "c" && isCtrled;
      const isPaste = e.key === "v" && isCtrled;

      if (isCopy) {
        component.copySelectedComponent();
      }
      if (isPaste) {
        component.pasteSelectedComponent();
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "Backspace":
          component.deleteSelected();
          break;
      }
    });
  }, []);

  return null;
});
