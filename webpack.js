const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // entryPoint.js is the main file of your application
    // from there all required parts of the application are imported
    // wepack will start to traverse imports starting from this file
    entry: "./out/example/index.js",
    plugins: [
        // clean files in webpack_dist before doing anything
        new CleanWebpackPlugin(['example/dist'])
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
    // the generated output will we place in webpack_dist as myApp.main.bundle.js in umd module format
    output: {
        libraryTarget: "umd",
        filename: 'fluxInTypescriptWithRx.bundle.js',
        path: path.resolve(__dirname, 'example/dist')
    }
};