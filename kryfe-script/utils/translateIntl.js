const fs = require('fs');
const { sync: globSync } = require('glob');
const { sync: mkdirpSync } = require('mkdirp');

const ROOT = process.cwd();
const MESSAGES_PATTERN = `${ROOT}/intl/messages/**/*.json`;
const LANG_DIR = `${ROOT}/public/lang/zh-CN/`;

module.exports = function () {
  const pages = {};
  
  globSync(MESSAGES_PATTERN)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .forEach(file => {
      file.forEach(({ id, defaultMessage }) => {
        const key = id.split('.')[0];
        
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
    fs.writeFileSync(LANG_DIR + `${key}.json`, JSON.stringify(pages[key], null, 2));
  }
};
