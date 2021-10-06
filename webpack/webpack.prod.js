const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name]-[contenthash].js',
        path: path.resolve(__dirname, '../build'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [{
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('autoprefixer')]
                            },
                        }
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('autoprefixer')]
                            },
                        }
                    },
                    'sass-loader'
                ]
            },
            // {
            //     test: /\.(jpg|png|svg|gif|jpeg)$/,
            //     use: [{
            //             loader: 'file-loader',
            //             options: {
            //                 name: '[name]-[contenthash].[ext]',
            //                 esModule: false,
            //             }
            //         },
            //         {
            //             loader: 'image-webpack-loader',
            //             options: {
            //                 mozjpeg: {
            //                     quality: 70,
            //                     progressive: true
            //                 }
            //             }
            //         },
            //     ]
            // },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', "!uploads/**"],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', 'public', 'index.html'),
            minify: {
                collapseWhitespace: true
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [{
                from: 'public/assets/mixkit-message-pop-alert-2354.mp3',
                to: 'mixkit-message-pop-alert-2354.mp3',
            }]
        }),
    ]
}