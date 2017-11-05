/**
 * Created by Zhang Junwei on 2017/3/11.
 */
var path = require('path')
var webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        main: __dirname + '/src/main.js',
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
        new CleanWebpackPlugin(['dist/*',], {verbose: true, dry: false,}),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(path.join(__dirname, '/node_modules')) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        new HtmlWebpackPlugin({template: 'index.html'}),
        new ExtractTextPlugin("main.css")
    ],
};