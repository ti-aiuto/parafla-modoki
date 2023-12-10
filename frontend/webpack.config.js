const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const main = {
  entry: {
    main: "./src/index.ts",
    preview: "./src/preview/preview.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "application-[name]-[chunkhash].js",
    assetModuleFilename: "[name]-[hash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: false,
              },
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "application-[chunkhash].css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["main"],
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "preview.html",
      chunks: ["preview"],
      template: "./src/preview/preview.html",
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.resolve(__dirname, "./src/"),
    },
    extensions: [".ts", ".js"],
  },
  target: ["web", "es5"],
};

module.exports = main;
