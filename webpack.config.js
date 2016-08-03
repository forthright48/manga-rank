const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const hotMiddleWare = 'webpack - hot - middleware / client ? path = /__webpack_hmr&timeout=20000';

module.exports = {
  context: __dirname,
  entry: {
    layout: [hotMiddleWare, './src/js/layout.js']
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
    publicPath: '/public'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css'),
      //loader: 'style!css-loader',
      include: [
        path.join(__dirname, 'src', 'css'),
        path.join(__dirname, 'node_modules', '@forthright48', 'simplecss')
      ]
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: [
        path.join(__dirname, 'src', 'js')
      ],
      query: {
        presets: ['es2015']
      }
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
};
