const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const portFinderSync = require('portfinder-sync');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const pageTitle = 'BOOKLEIS TESTS';
const port = portFinderSync.getPort(3000);

console.log('development = ' + isDev, 'production = ' + isProd)

const config = {
    entry: './src/js/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },

    devtool: isDev ? 'eval-cheap-module-source-map' : false,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                localIdentName: isDev ? '[local]__[hash:base64:4]' : '[hash:base64:8]'
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                              plugins: [
                                [
                                  "postcss-preset-env",
                                  {
                                    autoprefixer: {
                                        cascade: true,
                                        grid: true,
                                        flexbox: true,
                                    },
                                    minimize: isProd
                                  },
                                ],
                              ],
                              sourceMap: true,
                            },
                          },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['./src/scss/vars/index.scss', './src/scss/mixins/index.scss']
                        },
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            publicPath: './',
                        }
                    }
                ]
            },
        ]
    },

    optimization: {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: isDev ? false : true,
              },
            },
          }),
        ],
      },


    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: pageTitle,
            template: './src/index.html',
            inject: 'body',
            minify: false,
            hash: isProd ? true : false
        }),
    ],

    devServer: {
        historyApiFallback: true,
        port: port,
        open: true,
        hot: true,
        inline: true,
        overlay: {
            warnings: true,
            errors: true
        },
        contentBase: path.join(__dirname, 'src'),
        public: `localhost:${port}`,
    }
}

module.exports = () => config;
