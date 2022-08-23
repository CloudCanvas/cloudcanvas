import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import scss from "rollup-plugin-scss";
import svg from "rollup-plugin-svg-import";
import copy from "rollup-plugin-copy";

const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    scss(), // will output compiled styles to output.css
    svg({
      // process SVG to DOM Node or String. Default: false
      stringify: true,
    }),
    copy({
      targets: [
        {
          src: "src/fonts/CaveatBrush-Regular.ttf",
          dest: "lib/fonts",
        },
      ],
    }),
  ],
};
