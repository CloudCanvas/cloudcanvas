require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "xyz.cloudcanvas",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: "brianfoody@gmail.com",
    appleIdPassword: "tsnb-ouvc-hrtm-catd",
  });
};
