const fs = require("fs");
const { sync: globSync } = require("glob");
const { sync: mkdirpSync } = require("mkdirp");

const ROOT = process.cwd();

// 在项目的.babelrc配置中定义了组件语言包的抽取存放路径为./intl/messages
// 则当Webpack在扫描项目组件时，会将react-intl库定义的语言信息抽取
// 然后根据抽取的语言包与项目public/lang目录下特定语言版本进行融合
const MESSAGES_PATTERN = `${ROOT}/intl/messages/**/*.json`;
const LANG_DIR = `${ROOT}/public/lang/zh-CN/`;

module.exports = function() {
  const pages = {};

  globSync(MESSAGES_PATTERN)
    .map(filename => fs.readFileSync(filename, "utf8"))
    .map(file => JSON.parse(file))
    .forEach(file => {
      file.forEach(({ id, defaultMessage }) => {
        const key = id.split(".")[0];

        if (!pages[key]) {
          pages[key] = {};
        }

        const page = pages[key];
        if (!page[id]) {
          page[id] = defaultMessage;
        }
      });
    });

  mkdirpSync(LANG_DIR);

  for (const key in pages) {
    fs.writeFileSync(
      LANG_DIR + `${key}.json`,
      JSON.stringify(pages[key], null, 2)
    );
  }
};
