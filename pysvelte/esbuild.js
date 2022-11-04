/* eslint-disable import/no-extraneous-dependencies */
const { build } = require("esbuild");
const { esbuildDecorators } = require("@anatine/esbuild-decorators");
const { hideBin } = require("yargs/helpers");
const sveltePlugin = require("esbuild-svelte");
const sveltePreprocess = require("svelte-preprocess");
const yargs = require("yargs/yargs");

const { argv } = yargs(hideBin(process.argv));

/**
 * Build settings for JavaScript/TypeScript (including supported frameworks)
 *
 * This is called from python (via `subprocess`) to bundle visualization JS/TS
 * files.
 */
build({
  entryPoints: [argv.entry],
  bundle: true,
  plugins: [
    // Decorators (require by Lit)
    esbuildDecorators({}),
    // Svelte support
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: { css: true }
    })
  ],
  outfile: argv.outfile,
  format: "esm"
});
