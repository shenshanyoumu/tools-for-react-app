const commonConfig = require('./webpack.common');
const Merge = require('webpack-merge');
const { intlPluginList } = require('./plugins');

module.exports = Merge(commonConfig, {
  output: {},
  plugins: [
    ...intlPluginList,
  ]
});
