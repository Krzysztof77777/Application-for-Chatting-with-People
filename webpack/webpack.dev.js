import path from 'path';
import {
    CleanWebpackPlugin
} from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../', 'build'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        open: true,
        contentBase: path.resolve(__dirname, '../', 'public'),
        port: 5001,
    },
    devtool: "inline-source-map",
    module: {
        rules: [{
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(sass|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            // {
            //     test: /\.(jpg|png|svg|gif|jpeg)$/,
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name]-[contenthash].[ext]',
            //             esModule: false,
            //         }
            //     }, ]
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
        }),
        new CopyPlugin({
            patterns: [{
                from: 'public/assets/mixkit-message-pop-alert-2354.mp3',
                to: 'mixkit-message-pop-alert-2354.mp3',
            }]
        }),
    ]
}