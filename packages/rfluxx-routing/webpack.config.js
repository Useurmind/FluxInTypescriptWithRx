const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // entryPoint.js is the main file of your application
    // from there all required parts of the application are imported
    // wepack will start to traverse imports starting from this file
    entry: {
        routerStore: "./example/routerStore/index.tsx",
        siteMap: "./example/siteMap/index.tsx",
        pages: "./example/pages/index.tsx",
        evictedPages: "./example/evictedPages/index.tsx"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
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
        }),
        new HtmlWebpackPlugin({
            title: 'RFluxx Routing Examples'
        }),    
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'example'),
        hot: true
    },
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        libraryTarget: "umd",
        filename: 'rfluxx.[name].bundle.js',
        path: __dirname + 'example/dist'
    }
};