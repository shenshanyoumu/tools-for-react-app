const path = require("path");

function parseArgs(args) {
  const ret = {};

  // 项目中引入Webpack命令行工具，当配置了--config选项，则说明需要添加开发者自定义的配置
  args.forEach((val, index) => {
    if (val.indexOf("--") !== -1) {
      switch (val) {
        case "--config":
          const configPath = path.join(process.cwd(), args[index + 1]);
          ret["customConfig"] = require(configPath);
          break;
      }
    }
  });

  return ret;
}

module.exports = parseArgs;
