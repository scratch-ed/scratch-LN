const CopyWebpackPlugin = require('copy-webpack-plugin');
const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const webpack = require('webpack');

const base = {
    devServer: {
        contentBase: false,
        host: '0.0.0.0',
        port: process.env.PORT || 8008
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src'),
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};

module.exports = [   
    defaultsDeep({}, base, {
        target: 'web',
        entry: {
            'live_view':'./live_view/live_view.js',
            //'live_view_blocks':'./live_view/live_view_blocks.js',
            //'test':'./testWebpage/test.js',
            //'run':'./webtools/run.js',
            //'example':'./examples/example.js',
            //'createTest':'./examples/createTest.js',
        //'nice_live_view':'./examples/nice_live_view.js',
            //'markdown_scratch':'./webtools/markdown_scratch.js',
            //'exe_test':'./exe_test/exe_test.js',
           // 'scratchify':'./webtools/scratchify.js'
        },
        output: {
            filename: '[name].js',
            //libraryTarget: 'var',
            //library: 'scratchLN'
        },
       plugins: base.plugins.concat([
            new CopyWebpackPlugin([{
                from: './live_view/live_view.html',
                to: 'index.html'
            }]),new CopyWebpackPlugin([{
                from: './live_view/live_view_blocks.html',
                to: 'blocks.html'
            }]),
            new CopyWebpackPlugin([{
                from: './exe_test/exe_test.html',
                to: 'exe_test.html'
            }]),
            new CopyWebpackPlugin([{
                from: './testWebpage/test.html',
                to: 'test.html'
            }]),new CopyWebpackPlugin([{
                from: './examples/nice_live_view.html',
                to: 'view.html'
            }]),
            new CopyWebpackPlugin([{
                from: 'examples/example.html',
                to: 'example.html'
            }]),
            new CopyWebpackPlugin([{
                from: 'examples/cdjlogo.jpeg',
                to: 'cdjlogo.jpeg'
            }]),
            new CopyWebpackPlugin([{
                from: 'examples/simple.html',
                to: 'simple.html'
            }]),
            new CopyWebpackPlugin([{
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media'
            }])
        ]),
    }),
    /* defaultsDeep({}, base, {
        target: 'web',
        entry: {
            'ScratchLN':'./webtools/scratchify.js',
            //'auto_scratchify_language_scratch':'./webtools/markdown_scratch.js',
            //'auto_scratchify_scratch':'./webtools/run.js',
        },
        output: {
            filename: 'dist/[name].js',
            libraryTarget: 'var',
            library: 'scratchLN'
        },
        plugins: base.plugins.concat([
            new CopyWebpackPlugin([{
                from: 'node_modules/scratch-blocks/media',
                to: 'dist/static/blocks-media'
            }])
        ]),
    }) */
];
