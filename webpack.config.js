const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

dotenv.config();

const envConfig = {
  PROTON_WALLET_ADDRESS: process.env.PROTON_WALLET_ADDRESS || '',
  FORMSPREE_FORM_ID: process.env.FORMSPREE_FORM_ID || '',
  FORMSPREE_QUOTE_FORM_ID: process.env.FORMSPREE_QUOTE_FORM_ID || '',
  FORMSPREE_VISIT_FORM_ID: process.env.FORMSPREE_VISIT_FORM_ID || '',
  ACTIVATION_CODES: process.env.ACTIVATION_CODES || JSON.stringify({
    'PSI-WEB-0001': { id: 'web-design', quantity: 1, total: 1000 },
    'PSI-WEB-0002': { id: 'web-development', quantity: 1, total: 2500 },
    'PSI-WEB-0003': { id: 'web-launch', quantity: 1, total: 2000 },
    'PSI-CONT-0001': { id: 'web-care', quantity: 1, total: 1000 },
    'PSI-APP-0001': { id: 'cross-platform', quantity: 1, total: 5000 },
    'PSI-APP-0002': { id: 'licenses-distribution', quantity: 1, total: 2500 },
    'PSI-DATA-0001': { id: 'data-analysis', quantity: 1, total: 2500 },
    'PSI-SUP-0001': { id: 'technical-support', quantity: 1, total: 2000 }
  })
};

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PROTON_WALLET_ADDRESS': JSON.stringify(envConfig.PROTON_WALLET_ADDRESS),
      'process.env.FORMSPREE_FORM_ID': JSON.stringify(envConfig.FORMSPREE_FORM_ID),
      'process.env.FORMSPREE_QUOTE_FORM_ID': JSON.stringify(envConfig.FORMSPREE_QUOTE_FORM_ID),
      'process.env.FORMSPREE_VISIT_FORM_ID': JSON.stringify(envConfig.FORMSPREE_VISIT_FORM_ID),
      'process.env.ACTIVATION_CODES': JSON.stringify(envConfig.ACTIVATION_CODES),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};