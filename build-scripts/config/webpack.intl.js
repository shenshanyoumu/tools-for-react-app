const commonConfig = require("./webpack.common");
const Merge = require("webpack-merge");
const { intlPluginList } = require("./plugins");

// 抽取项目中组件语言包的打包配置
module.exports = Merge(commonConfig, {
  output: {},
  plugins: [...intlPluginList]
});
