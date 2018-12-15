const webpack = require('webpack');
const Merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const commonConfig = require('../webpack.common');
const { pluginList } = require('../plugins');

module.exports = Merge(commonConfig, {
  devtool: 'source-map',
  output: {
    publicPath: process.env.HOST_CDN,
  },
  plugins: [
    ...pluginList,
    new UglifyJSPlugin({
      parallel: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
