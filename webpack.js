const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // entryPoint.js is the main file of your application
    // from there all required parts of the application are imported
    // wepack will start to traverse imports starting from this file
    entry: {
        counter: "./out/example/counter/index.js",
        asyncAction: "./out/example/asyncAction/index.js",
        middleware: "./out/example/middleware/index.js"
    },
    plugins: [
        // clean files in webpack_dist before doing anything
        new CleanWebpackPlugin([
            'example/dist'
        ])
    ],
    plugins: [
        // we provide es5 and es6 shim as plugins via webpack
        // you need to extend the entry point for this to work, see below
        new webpack.ProvidePlugin({
            es5: 'es5-shim',
            es6: 'es6-shim'
        })
    ],
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        libraryTarget: "umd",
        filename: 'fluxInTypescriptWithRx.[name].bundle.js',
        path: path.resolve(__dirname, 'example/dist')
    }
};