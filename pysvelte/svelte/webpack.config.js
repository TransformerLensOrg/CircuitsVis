/*
Build all:
   npx webpack

Build and serve:
    npx webpack serve

Build only some files (faster):
    npx webpack --env=entry="loader,TextMulti"

Build and serve only some file (faster):
    npx webpack serve --env=entry="loader,TextMulti"
*/



const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

function make_entry_map(env) {
    /* Make an "entry map" describing which files should be built.

    When env.entry is set (meaning we only build some files), we also
    delete old built verisons of the file. This is important because the
    regular build cleaning mechanisms can only clean all or no files, and
    we don't want to delete the built versions of files we decided to not
    rebuild for efficiency.

    Args:
      env: A variable created by webpack which allows user-specified values
        to be passed into the build script. For our purposes, env is an
        object with one property, entry, a comma delimited string describing
        what to build. A typical example value would be
        env={entry: "loader,TextMulti"}

    Returns:
      An "entry map" describing what to build (see
        https://webpack.js.org/concepts/entry-points/). For example:

        entry = {
            "loader": "./src/loader.js",
            "TextMulti": "./src/TextMulti.svelte"
        }

    */
    var entry_map = { "loader": "./src/loader.js" };
    glob.sync("./src/*/main.svelte").forEach(path => {
        var name = path.replace("./src/", "").replace("/main.svelte", "");
        if (name.startsWith("components/") || name.startsWith("utils/")) {
            return;
        }
        entry_map[name] = path;
    })
    glob.sync("./src/*.svelte").forEach(path => {
        var name = path.replace("./src/", "").replace(".svelte", "");
        if (name.startsWith("components/") || name.startsWith("utils/")) {
            return;
        }
        entry_map[name] = path;
    })
    if (env.entry != undefined) {
        var raw_entry_map = entry_map;
        entry_map = {}
        for (var entry of env.entry.split(",")){
            entry_map[entry] = raw_entry_map[entry];
        }
        // We delete the compiled javascript files for any
        // files being specified with env.entry.
        // This is because when we only build some files,
        // we can no longer rely on webpack's normal
        // cleaning utils.
        for (var name in entry_map){
            fs.unlink("./dist/"+name+".js", () => 1);
        }
    }
    console.log("entry: %j", entry_map)
    return entry_map;
}

// The module exports describe what to build
// see https://webpack.js.org/concepts/ for documentation
//
module.exports = env => ({
    mode: "production",
    // https://webpack.js.org/configuration/entry-context/
    entry: make_entry_map(env),
    // https://webpack.js.org/configuration/module/
    module: {
        rules: [
            {
                test: /\.svelte/,
                use: 'svelte-loader',
                exclude: /node_modules/,
                resolve: {
                    fullySpecified: false // load Svelte correctly
                }
            },
        ],
    },
    // https://webpack.js.org/configuration/optimization/
    optimization: {
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2015'
            })
        ],
    },
    // https://webpack.js.org/configuration/target/
    target: 'web',
    // https://webpack.js.org/configuration/output/
    output: {
        // note [name] refers to the entry map
        // For example:
        //
        //     {"TextMulti": "./src/TextMulti.svelte"}
        //
        // means "./src/TextMulti.svelte" will be built as
        // "TextMulti.js" = "[name].js"
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '[name]',
        libraryExport: 'default',
        libraryTarget: 'var'
    },
    // If we are building all files (ie. not specifying
    // a limited number to build with env.entry) we use
    // webpacks clean functionality.
    plugins: (env.entry == undefined)? [new CleanWebpackPlugin()] : [],
    // https://webpack.js.org/configuration/watch/
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 200,
        poll: 1000
    },
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        injectClient: false,
        port: 9000,
        allowedHosts: [
            'colab.research.google.com',
        ],
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }

});
