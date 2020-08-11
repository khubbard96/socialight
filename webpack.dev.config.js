const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: {
        app: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/app.js'],
        login: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/login.js'],
        new_login: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/new-login.js']
    },
    output: {
        path: path.join(path.resolve('./'), 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    mode: 'development',
    target: 'web',
    devtool: '#source-map',

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins 
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        //options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/html/index.html",
            filename: "./index.html",
            excludeChunks: ['server','app','login']
        }),
        new HtmlWebPackPlugin({
            template: "./src/html/app.html",
            filename: "./app.html",
            chunks: ['app'],
        }),
        new HtmlWebPackPlugin({
            template: "./src/html/groups.html",
            filename: "./groups.html",
            chunks: ['app'],
        }),
        new HtmlWebPackPlugin({
            template: "./src/html/login.html",
            filename: "./login.html",
            chunks: ['login'],
        }),
        new HtmlWebPackPlugin({
            template: "./src/html/new-login.html",
            filename: "./new-login.html",
            chunks: ['new_login'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}