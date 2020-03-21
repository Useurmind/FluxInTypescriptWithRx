const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => ({
    plugins: [
        new webpack.DefinePlugin({
            "PRODUCTION": false
        }),          
    ]
});