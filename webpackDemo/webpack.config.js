/**
 * Created by Zhang Junwei on 2017/3/11.
 */
var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        home: ['degree.js', 'project.js', 'setting.js'],
        about: "./about.js",
        contact: "./contact.js"
    },
    output: {
        path: path.resolve(__dirname, "release"),
        filename: 'js/[name]-[chunkhash].js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader" },
        ]
    }
};