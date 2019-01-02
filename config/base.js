const path = require("path");
const devMode = process.env.NODE_ENV !== "production";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/**
 * webpack 基础配置
 */
const pubPath = __dirname.split("config")[0];
const antdTheme = {
    // "@icon-url": `"${path.resolve(pubPath, "src/workbench_front/assets/")}/iconfont/antd-iconfont/iconfont"`
    "@icon-url": `"/nccloud/resources/workbench/public/common/main/assets/iconfont/antd-iconfont/iconfont"`
};
module.exports = {
    configInfo: {
        context: path.resolve(pubPath, "src/workbench_front"),
        entry: "./app.js",
        // 包(bundle)应该运行的环境
        target: "web",
        // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
        externals: {
            // axios: {
            //     root: "axios",
            //     var: "axios",
            //     commonjs: "axios",
            //     commonjs2: "axios",
            //     amd: "axios"
            // },
            react: {
                root: "React",
                var: "React",
                commonjs: "react",
                commonjs2: "react",
                amd: "react"
            },
            "@antv/g6": {
                root: "G6",
                var: "G6",
                commonjs: "@antv/g6",
                commonjs2: "@antv/g6",
                amd: "@antv/g6"
            },
            "react-router": {
                root: "ReactRouter",
                var: "ReactRouter",
                commonjs: "react-router",
                commonjs2: "react-router",
                amd: "react-router"
            },
            "react-dom": {
                root: "ReactDOM",
                var: "ReactDOM",
                commonjs: "react-dom",
                commonjs2: "react-dom",
                amd: "react-dom"
            },
            "babel-polyfill": "babel-polyfill",
            "nc-lightapp-front": "nc-lightapp-front"
        },
        optimization: {
            splitChunks: {
                minSize: 50000,
                maxAsyncRequests: 7,
                maxInitialRequests: 7,
                name: true,
                cacheGroups: {
                    default: false,
                    commons: {
                        test: /pub[\\/]|components[\\/]|store[\\/]|layout[\\/]|pages[\\/]|app|theme[\\/]|assets[\\/]/,
                        name: "commons",
                        chunks: "initial",
                        priority: -10
                    },
                    lightApp: {
                        test: /[\\/]node_modules[\\/]nc-lightapp-front[\\/]/,
                        name: "nc-lightapp-front",
                        priority: -10,
                        chunks: "async"
                    },
                    antdui: {
                        test: /[\\/]node_modules[\\/]antd[\\/]/,
                        name: "antd-ui",
                        priority: -10,
                        chunks: "all"
                    },
                    lodash: {
                        test: /[\\/]node_modules[\\/]lodash[\\/]/,
                        name: "lodash",
                        priority: -10,
                        chunks: "all"
                    },
                    venders: {
                        test: /[\\/]node_modules[\\/]pako[\\/]|[\\/]node_modules[\\/]core-js[\\/]|[\\/]node_modules[\\/](react-)\S+[\\/]|[\\/]node_modules[\\/]redux[\\/]|[\\/]node_modules[\\/]hammerjs[\\/]/,
                        name: "venders",
                        priority: -10,
                        chunks: "all"
                    },
                    rcbase: {
                        test: /[\\/]node_modules[\\/](rc-)\S+[\\/]/,
                        name: "rcbase",
                        priority: -10,
                        chunks: "all"
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.(css|less)$/,
                    // exclude: /node_modules/,
                    use: [
                        devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        {
                            loader: "less-loader",
                            options: {
                                javascriptEnabled: true,
                                modifyVars: antdTheme
                            }
                        }
                    ]
                    // loader: 'style-loader!postcss-loader!less-loader'
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
                    exclude: /favicon\.png$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 500,
                                name: "[name].[ext]",
                                outputPath: "images/"
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|ttf|woff|woff2|svgz)(\?.+)?$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "font/"
                            }
                        }
                    ]
                },
            ]
        },
        resolve: {
            extensions: [".jsx", ".js"],
            alias: {
                Components: path.resolve(
                    pubPath,
                    "src/workbench_front/components/"
                ),
                Assets: path.resolve(pubPath, "src/workbench_front/assets/"),
                Pages: path.resolve(pubPath, "src/workbench_front/pages/"),
                Pub: path.resolve(pubPath, "src/workbench_front/pub/"),
                Store: path.resolve(pubPath, "src/workbench_front/store/")
            }
        }
    },
    pubPath: pubPath
};
