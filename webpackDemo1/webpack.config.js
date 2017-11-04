/**
 * Created by Zhang Junwei on 2017/3/11.
 */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        main: __dirname + '/src/main.js',
        vendor: 'moment'
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})},
            {test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader"},
        ]
    },
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: true,
        inline: true
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({template: 'index.html'}),
        new ExtractTextPlugin("main.css")
    ],
};