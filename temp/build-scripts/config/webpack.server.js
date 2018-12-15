const commonConfig = require('./webpack.common');
const Merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const { serverPluginList } = require('./plugins');

module.exports = Merge(commonConfig, {
  devtool: 'source-map',
  entry: './src/server.js',
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [
    ...serverPluginList,
  ]
});
