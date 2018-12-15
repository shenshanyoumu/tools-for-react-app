const path = require("path");
const webpack = require("webpack");
const commonConfig = require("../webpack.common");
const Merge = require("webpack-merge");
const { pluginList } = require("../plugins");

module.exports = Merge(commonConfig, {
  devtool: "eval-source-map",
  entry: {
    main: ["react-hot-loader/patch", "./src/index.jsx"]
  },
  plugins: [
    ...pluginList,
    // 用于在增量打包时对chunk命名
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }

      return chunk
        .mapModules(m => path.relative(m.context, m.request))
        .join("_");
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
