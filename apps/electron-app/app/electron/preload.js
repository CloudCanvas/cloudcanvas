const { contextBridge, ipcRenderer } = require("electron");

const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
// const ContextMenu = require("secure-electron-context-menu").default;
const SecureElectronLicenseKeys = require("secure-electron-license-keys");

// Create the electron store to be made available in the renderer process
const store = new Store();

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const element = document.elementFromPoint(e.pageX, e.pageY);

  // Need to somehow trabslate the bvalues if it's the outside container
  const isOuterContainer = element.id === "container";
  const isCanvasContainer = element.id === "canvasContainer";

  let actualLocationX = isCanvasContainer ? e.offsetX : undefined;
  let actualLocationY = isCanvasContainer ? e.offsetY : undefined;

  if (element && !isCanvasContainer) {
    try {
      const boundingRect = element.getBoundingClientRect();
      const x = boundingRect.x;
      const y = boundingRect.y;

      actualLocationX = x + e.offsetX;
      actualLocationY = y + e.offsetY;
    } catch (err) {}
  }

  ipcRenderer.send("show-context-menu", {
    pageX: e.pageX,
    pageY: e.pageY,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
    actualLocationX,
    actualLocationY,
    disabled: isOuterContainer,
  });
});

/**
 * Command structure is;
 *
 * {
 *  type: "add-resource"; // no other ones yet
 *  location: {
 *      pageX: number;
 *      pageY: number;
 *      offsetX: number;
 *      offsetY: number;
 *      actualLocationX: number;
 *      actualLocationY: number;
 *  }
 * }
 */
ipcRenderer.on("context-menu-command", (e, command) => {
  const channel = new BroadcastChannel("app-data");
  channel.postMessage(command);
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer, process),
  store: store.preloadBindings(ipcRenderer, fs),
  clipboard: {
    writeText: async (text) => {
      await ipcRenderer.invoke("copy-to-clipboard", text);
    },
  },
  // Goto ports/aws.ts for typings
  aws: {
    access: async () => {
      return await ipcRenderer.invoke("app:aws-access");
    },
    authoriseOrg: async (ssoUrl) => {
      const response = await ipcRenderer.invoke("app:aws-authoriseOrg", ssoUrl);
      return response;
    },
    lightAuthorise: async (accessPair) => {
      return await ipcRenderer.invoke("app:aws-lightAuthorise", accessPair);
    },
    refreshOrg: async (ssoUrl) => {
      return await ipcRenderer.invoke("app:aws-refreshOrg", ssoUrl);
    },
    provideNickname: async (nickname, ssoUrl) => {
      return await ipcRenderer.invoke(
        "app:aws-provideNickname",
        nickname,
        ssoUrl
      );
    },
    addOrganisation: async (details) => {
      return await ipcRenderer.invoke("app:aws-addOrganisation", details);
    },
    deleteOrganisation: async (ssoUrl) => {
      return await ipcRenderer.invoke("app:aws-deleteOrganisation", ssoUrl);
    },
    // dynamo: {
    //   listTables: async (access) => {
    //     return await ipcRenderer.invoke("app:aws-dynamo-list-tables", access);
    //   },
    // },
    // dynamoStream: {
    //   createDynamoStreamManager: async (access, tableName) => {
    //     return await ipcRenderer.invoke(
    //       "app:aws-dynamostream-create-manager",
    //       JSON.stringify(access),
    //       tableName
    //     );
    //   },
    // },
  },
  // contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  licenseKeys: SecureElectronLicenseKeys.preloadBindings(ipcRenderer),
});
