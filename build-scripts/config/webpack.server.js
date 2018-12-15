const commonConfig = require("./webpack.common");
const Merge = require("webpack-merge");
const { serverPluginList } = require("./plugins");

// 进行SSR的配置
module.exports = Merge(commonConfig, {
  devtool: "source-map",
  entry: "./src/server.js",
  output: {
    filename: "server.js",
    libraryTarget: "commonjs2"
  },
  target: "node",
  node: {
    __dirname: true,
    __filename: true
  },
  plugins: [...serverPluginList]
});
