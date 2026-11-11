const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Formspree IDs are injected when Webpack builds the browser bundle.
// GitHub Actions writes the same values to .env before this command runs.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const envConfig = {
  FORMSPREE_FORM_ID: process.env.FORMSPREE_FORM_ID || '',
  FORMSPREE_QUOTE_FORM_ID: process.env.FORMSPREE_QUOTE_FORM_ID || '',
  FORMSPREE_VISIT_FORM_ID: process.env.FORMSPREE_VISIT_FORM_ID || ''
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
      'process.env.FORMSPREE_FORM_ID': JSON.stringify(envConfig.FORMSPREE_FORM_ID),
      'process.env.FORMSPREE_QUOTE_FORM_ID': JSON.stringify(envConfig.FORMSPREE_QUOTE_FORM_ID),
      'process.env.FORMSPREE_VISIT_FORM_ID': JSON.stringify(envConfig.FORMSPREE_VISIT_FORM_ID),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.svg',
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
