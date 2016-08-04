const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const hotReload = 'webpack-dev-server/client?http://localhost:8080/';
const hotModuleReplacement = 'webpack/hot/dev-server';

/*module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: {
    layout: [hotReload, hotModuleReplacement, './src/js/layout.js']
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].js',
    publicPath: '/public'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css'),
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
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css')
  ],
  devServer: {
    contentBase: './build'
  }
};
*/

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: {
    layout: [
      hotReload,
      hotModuleReplacement,
      './src/js/layout.js'
    ]
  },
  output: {
    path: './build',
    filename: '[name].bundle.js',
    //chunkFilename: '[id].chunk.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css'),
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
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './build'
  }
};
