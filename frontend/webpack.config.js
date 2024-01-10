const {VueLoaderPlugin} = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const main = {
  entry: {
    editor: './src/editor/editor.ts',
    preview: './src/preview/preview.ts',
    player: './src/player/player.ts',
    player_program: './src/player/player_program.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'application-[name]-[chunkhash].js',
    assetModuleFilename: '[name]-[hash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
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
      filename: 'application-[chunkhash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'editor.html',
      chunks: ['editor'],
      template: './src/editor/editor.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'preview.html',
      chunks: ['preview'],
      template: './src/preview/preview.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'player.html',
      chunks: ['player_program', 'player'],
      chunksSortMode: 'manual',
      template: './src/player/player.html',
      scriptLoading: 'blocking',
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src/'),
    },
    extensions: ['.ts', '.js'],
  },
  target: ['web', 'es5'],
};

module.exports = main;
