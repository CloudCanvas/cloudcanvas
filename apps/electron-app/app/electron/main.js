const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  Menu,
  shell,
} = require("electron");
const os = require("os");
const SecureElectronLicenseKeys = require("secure-electron-license-keys");
const Protocol = require("./protocol");
const MenuBuilder = require("./menu");
const i18nextBackend = require("i18next-electron-fs-backend");
const i18nextMainBackend = require("../localization/i18n.mainconfig");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const isDev = process.env.NODE_ENV === "development";
const { clipboard } = require("electron");
const port = 40992; // Hardcoded; needs to match webpack.development.js and package.json
const selfHost = `http://localhost:${port}`;
const {
  makeAwsConfigManager: makeAccessConfigManager,
  makeSsoAccessProvider,
} = require("@cloudcanvas/aws-sso-global-access-provider");
const {
  makeAwsConfigManager: makeAuthoriserConfigManager,
  makeSsoAuthoriser,
} = require("@cloudcanvas/aws-sso-api");

let awsClient;

const getAccessProvider = async () => {
  if (awsClient) return awsClient;

  const accessConfigManager = makeAccessConfigManager({
    homeDir: os.homedir(),
  });
  const authConfigManager = makeAuthoriserConfigManager({
    homeDir: os.homedir(),
  });

  const ssoAuthoriser = makeSsoAuthoriser({
    browser: {
      open: async (path) => {
        await shell.openExternal(path);
      },
    },
    configManager: authConfigManager,
  });

  const accessProvider = makeSsoAccessProvider({
    authoriser: ssoAuthoriser,
    configManager: accessConfigManager,
  });

  await accessProvider.init();

  awsClient = accessProvider;

  return awsClient;
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let menuBuilder;

async function createWindow() {
  // If you'd like to set up auto-updating for your app,
  // I'd recommend looking at https://github.com/iffy/electron-updater-example
  // to use the method most suitable for you.
  // eg. autoUpdater.checkForUpdatesAndNotify();

  if (!isDev) {
    // Needs to happen before creating/loading the browser window;
    // protocol is only used in prod
    protocol.registerBufferProtocol(
      Protocol.scheme,
      Protocol.requestHandler
    ); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
  }

  const store = new Store({
    path: app.getPath("userData"),
  });

  // Use saved config values for configuring your
  // BrowserWindow, for instance.
  // NOTE - this config is not passcode protected
  // and stores plaintext values
  //let savedConfig = store.mainInitialStore(fs);

  // Create the browser window.
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Loading AWS Profiles...",
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      additionalArguments: [
        `--storePath=${store.sanitizePath(app.getPath("userData"))}`,
      ],
      preload: path.join(__dirname, "preload.js"),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: "Auxclick",
    },
  });

  // Sets up main.js bindings for our i18next backend
  i18nextBackend.mainBindings(ipcMain, win, fs);

  // Sets up main.js bindings for our electron store;
  // callback is optional and allows you to use store in main process
  const callback = function (success, initialStore) {
    console.log(
      `${!success ? "Un-s" : "S"}uccessfully retrieved store in main process.`
    );
    console.log(initialStore); // {"key1": "value1", ... }
  };

  store.mainBindings(ipcMain, win, fs, callback);

  // Sets up bindings for our custom context menu
  ContextMenu.mainBindings(ipcMain, win, Menu, isDev, {
    loudAlertTemplate: [
      {
        id: "loudAlert",
        label: "AN ALERT!",
      },
    ],
    softAlertTemplate: [
      {
        id: "softAlert",
        label: "Soft alert",
      },
    ],
    default: [
      {
        label: "Edit",
        submenu: [
          {
            role: "undo",
          },
          {
            role: "redo",
          },
          {
            type: "separator",
          },
          {
            role: "cut",
          },
          {
            role: "copy",
          },
          {
            role: "paste",
          },
        ],
      },
    ],
  });

  // Setup bindings for offline license verification
  SecureElectronLicenseKeys.mainBindings(ipcMain, win, fs, crypto, {
    root: process.cwd(),
    version: app.getVersion(),
  });

  // Load app
  if (isDev) {
    win.loadURL(selfHost);
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index.html`);
  }

  win.webContents.on("did-finish-load", () => {
    win.setTitle(`s3o(v${app.getVersion()})`);
  });

  // Only do these things when in development
  if (isDev) {
    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    // win.webContents.once("dom-ready", async () => {
    //   await installExtension([REACT_DEVELOPER_TOOLS])
    //     // await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    //     .then((name) => console.log(`Added Extension: ${name}`))
    //     .catch((err) => console.log("An error occurred: ", err))
    //     .finally(() => {
    //       require("electron-debug")(); // https://github.com/sindresorhus/electron-debug
    //       win.webContents.openDevTools();
    //     });
    // });
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
  ses
    .fromPartition(
      partition
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
        );

        permCallback(false); // Deny
      }
    });

  // https://electronjs.org/docs/tutorial/security#1-only-load-secure-content;
  // The below code can only run when a scheme and host are defined, I thought
  // we could use this over _all_ urls
  // ses.fromPartition(partition).webRequest.onBeforeRequest({urls:["http://localhost./*"]}, (listener) => {
  //   if (listener.url.indexOf("http://") >= 0) {
  //     listener.callback({
  //       cancel: true
  //     });
  //   }
  // });

  menuBuilder = MenuBuilder(win, app.name);

  // Set up necessary bindings to update the menu items
  // based on the current language selected
  i18nextMainBackend.on("initialized", (loaded) => {
    i18nextMainBackend.changeLanguage("en");
    i18nextMainBackend.off("initialized"); // Remove listener to this event as it's not needed anymore
  });

  // When the i18n framework starts up, this event is called
  // (presumably when the default language is initialized)
  // BEFORE the "initialized" event is fired - this causes an
  // error in the logs. To prevent said error, we only call the
  // below code until AFTER the i18n framework has finished its
  // "initialized" event.
  i18nextMainBackend.on("languageChanged", (lng) => {
    if (i18nextMainBackend.isInitialized) {
      menuBuilder.buildMenu(i18nextMainBackend);
    }
  });
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
    ContextMenu.clearMainBindings(ipcMain);
    SecureElectronLicenseKeys.clearMainBindings(ipcMain);
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on("will-redirect", (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on(
    "will-attach-webview",
    (contentsEvent, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload;
      delete webPreferences.preloadURL;

      // Disable Node.js integration
      webPreferences.nodeIntegration = false;
    }
  );

  // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  // This code replaces the old "new-window" event handling;
  // https://github.com/electron/electron/pull/24517#issue-447670981
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const validOrigins = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
      );

      return {
        action: "deny",
      };
    }

    return {
      action: "allow",
    };
  });
});

/**
 * These calls request sensitive data and use node modules so they need to be executed on ipcMain thread
 * on not in the browser.
 *
 * The renderer requests these commands be run and we execute and send the response.
 *
 * We never give the browser access to the library or file system.
 */
ipcMain.handle("app:aws-access", async (_event) => {
  const accessProvider = await getAccessProvider();

  return accessProvider.access();
});

ipcMain.handle("app:aws-addOrganisation", async (_event, details) => {
  const accessProvider = await getAccessProvider();

  return await accessProvider.addOrganisation(details);
});

ipcMain.handle("app:aws-deleteOrganisation", async (_event, ssoStartUrl) => {
  const accessProvider = await getAccessProvider();

  return await accessProvider.deleteOrganisation(ssoStartUrl);
});

ipcMain.handle("app:aws-lightAuthorise", async (_event, accessPair) => {
  try {
    console.log("Light authorise");
    console.log(accessPair);

    const accessProvider = await getAccessProvider();

    const organisation = await accessProvider.lightAuthorise(accessPair);

    return organisation;
  } catch (err) {}
});

ipcMain.handle("app:aws-authoriseOrg", async (_event, ssoUrl) => {
  const accessProvider = await getAccessProvider();

  const access = await accessProvider.authoriseOrg(ssoUrl);

  console.log("mainjs");
  console.log(access);

  return access;
});

ipcMain.handle("app:aws-refreshOrg", async (_event, ssoUrl) => {
  const accessProvider = await getAccessProvider();

  const access = await accessProvider.refreshOrg(ssoUrl);

  return access;
});

ipcMain.handle("app:aws-provideNickname", async (_event, nickname, ssoUrl) => {
  const accessProvider = await getAccessProvider();

  const access = await accessProvider.provideNickname(nickname, ssoUrl);

  return access;
});

/**
 * Clipboard
 */
ipcMain.handle("copy-to-clipboard", async (_event, text) => {
  clipboard.writeText(text);
});

let invalidCount = 0;
/**
 * We render the menu on main thead and send the response back to the browser
 */
ipcMain.on("show-context-menu", (event, args) => {
  let template = [];

  // TODO "tap" the line by making it flash
  if (args.disabled) {
    invalidCount++;

    template.push({
      label:
        invalidCount % 2 === 1
          ? "For now resources have to be created inside the line."
          : "Don't make me tap the line 😅.",
      click: () => {
        // event.sender.send("context-menu-command", {
        //   type: "add-resource",
        //   location: args,
        // });
      },
    });
  } else {
    template.push({
      label: "Add resource",
      click: () => {
        event.sender.send("context-menu-command", {
          type: "add-resource",
          location: args,
        });
      },
    });
  }

  if (isDev) {
    template.push({
      label: "Inspect",
      click: () => {
        win.inspectElement(args.pageX, args.pageY);
      },
    });
  }
  const menu = Menu.buildFromTemplate(template);
  menu.popup(BrowserWindow.fromWebContents(event.sender));
});
