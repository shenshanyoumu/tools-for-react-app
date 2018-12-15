const Merge = require("webpack-merge");
const parseArgs = require("./webpackCompileParseArgs");

module.exports = function webpackCompileWrapper(compile, config) {
  // 在项目的package.json文件的scripts字段启动Webpack时，收集其参数
  const ret = parseArgs(process.argv.slice(2));

  let newConfig = config;

  // 如果开发者有自定义的Webpack配置文件
  if (ret.customConfig) {
    // 根据开发者自定义的WebPack配置文件中module.rules的“override”要求
    // 对tools库相应的配置信息进行覆盖处理
    newConfig = Merge({
      customizeArray(a, b, key) {
        if (key === "module.rules" && b[0].type === "override") {
          b.shift();
          return b;
        }

        return undefined;
      }
    })(config, ret.customConfig);
  }

  return compile(newConfig);
};
