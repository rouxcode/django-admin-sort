
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const exclusions = /node_modules/;

const node_modules = path.resolve(__dirname, 'node_modules')
const static = path.resolve(__dirname, "../admin_sort/static")
const static_src = path.resolve(__dirname, "../admin_sort/static_src")


module.exports = [
    {
        resolve: {
            // add custom  node_modules import path
            modules: [node_modules, 'node_modules'],
        },
        entry: {
            // project assets
            'admin_sort/sort': static_src + "/sort.js",
        },
        output: {
            path: static,
            filename: "[name].js",
        },
        plugins: [
            new MiniCssExtractPlugin(),
        ],
        module: {
            rules: [
                // sass/scss compiler
                {
                    test: /\.scss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                // image handler
                {
                    test: /\.(svg|png|jpg|gif|webp|eot|woff|woff2|ttf|otf)$/,
                    exclude: exclusions,
                    use: {
                        loader: 'file-loader',
                        options: {
                            context: static_src,
                            name: '[path][name].[ext]'
                        }
                    }
                },
            ],
        },
    },
];
