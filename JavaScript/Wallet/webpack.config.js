const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.ETHEREUM_SEPOLIA_RPC': JSON.stringify(process.env.ETHEREUM_SEPOLIA_RPC),
      'process.env.ETHEREUM_MAINNET_RPC': JSON.stringify(process.env.ETHEREUM_MAINNET_RPC),
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
  },
};
