/**
 * Created by Zhang Junwei on 2017/3/11.
 */
var webpack = require('webpack');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: __dirname,
        filename: 'src/js/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader" },
        ]
    }
};