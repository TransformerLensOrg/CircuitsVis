/* eslint-disable import/no-extraneous-dependencies */
const esbuild = require("esbuild");
const { externalGlobalPlugin } = require("esbuild-plugin-external-global");

/**
 * CDN IIFE Build (with React)
 */
esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/cdn/iife.js",
  bundle: true,
  target: "es6",
  minify: true,
  legalComments: "none",
  sourcemap: true,
  globalName: "CircuitsVis" // Components available as e.g. `CircuitsVis.Hello`
});

/**
 * CDN ESM Build (with React)
 */
esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/cdn/esm.js",
  bundle: true,
  target: "es2020",
  format: "esm",
  minify: true,
  platform: "browser",
  legalComments: "none",
  sourcemap: true
});

/**
 * CDN IIFE Build (without React)
 *
 * This allows the user to import and run alongside their own browser import of
 * React (whichever version that may be).
 */
esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/cdn/without-react.iife.js",
  bundle: true,
  target: "es6",
  minify: true,
  legalComments: "none",
  sourcemap: true,
  globalName: "CircuitsVis", // Components available as e.g. `CircuitsVis.Hello`
  plugins: [
    // Exclude React/ReactDom from the browser
    externalGlobalPlugin({
      react: "window.React",
      "react-dom": "window.ReactDOM"
    })
  ]
});

/**
 * CommonJS Version
 */
esbuild.build({
  entryPoints: ["src/index.ts"],
  outdir: "dist/commonjs/",
  external: ["./node_modules/*"],
  sourcemap: true,
  bundle: true,
  target: ["node12"],
  platform: "node",
  format: "cjs"
});
