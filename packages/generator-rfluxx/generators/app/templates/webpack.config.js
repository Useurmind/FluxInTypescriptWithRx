const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const appName = "<%= name %>";
const appTitle = "<%= title %>";

module.exports = (params) => ({
    // entryPoint.js is the main file of your application
    // from there all required parts of the application are imported
    // wepack will start to traverse imports starting from this file
    entry: {
        main: "./src/index.tsx"
    },
    resolve: {
        // Example files are only in ts form, libraries should be loaded from js form
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            "react$": path.resolve(__dirname, "node_modules/react"),
            "react-dom$": path.resolve(__dirname, "node_modules/react-dom"),
            "@material-ui": path.resolve(__dirname, "node_modules/@material-ui")
        }
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: appTitle
        }),
        new HtmlWebpackRootPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),        
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(params.isProduction)
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
        hot: true,
        historyApiFallback: true
    },
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        libraryTarget: "umd",
        filename: appName + '.[name].bundle.js',
        path: __dirname + 'dist',
        publicPath: "/"
    }
});