const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const http = require('http');

const __ROOT__ = path.join(process.cwd(), 'public/lang');
const serviceCode = process.env.SERVICE_NAME;
const HOST = {
  citest: 'citest-ps-ml.shishike.com',
  gld: 'gld-ps-ml.keruyun.com',
  prod: 'ps-ml.keruyun.com',
}[process.env.SERVICE_ENV || 'citest'];
const PATH = '/internation/api/internation/json/imports';

if (!serviceCode) {
  console.error(
    chalk.red(
      `Error: You project name is required. Please set as 'SERVICE_NAME' like 'SERVICE_NAME=supply-ui'`
    )
  );
  process.exit(1);
}
if (!HOST) {
  console.error(
    chalk.red(
      `Error: 'SERVICE_ENV' is not found. please use 'citest', 'gld', 'prod'.`
    )
  );
  process.exit(1);
}

console.log(
  `Start to upload ${serviceCode} international language package in environment ${process
    .env.SERVICE_ENV || 'citest'}...`
);

function uploadIntl() {
  const obj = {};
  const ans = [];
  const lang = fs.readdirSync(__ROOT__);
  lang.forEach(dir => {
    const PACKAGE_DIR = path.join(__ROOT__, dir);
    const FILE_LIST = fs.readdirSync(PACKAGE_DIR);
    obj[dir] = {};
    FILE_LIST.forEach(fileDir => {
      const file = require(path.join(PACKAGE_DIR, fileDir));
      obj[dir][fileDir.split('.')[0]] = file;
    });
  });

  Object.keys(obj['zh-CN']).forEach(packageKey => {
    Object.keys(obj['zh-CN'][packageKey]).forEach(key => {
      if (key.length > 64)
        console.log(chalk.red(`Warning: Key too long -> ${key}`));
      const keyObj = {
        key,
        keyDescribe: obj['zh-CN'][packageKey][key],
        lines: lang
          .map(languageCode => {
            if (
              obj[languageCode][packageKey] &&
              obj[languageCode][packageKey][key]
            ) {
              return {
                languageCode: languageCode.replace('-', '_'),
                value: obj[languageCode][packageKey][key],
              };
            }
            return null;
          })
          .filter(line => line),
        serviceCode,
        source: packageKey,
      };
      ans.push(keyObj);
    });
  });

  const options = {
    host: HOST,
    path: PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, res => {
    res.on('data', data => {
      console.log(
        chalk.green(`Done! Here is the response :\n ${data.toString()}`)
      );
    });
  });

  req.on('error', e => {
    console.log(chalk.red(`上传过程中遇到问题：${e.message}`));
  });

  req.write(JSON.stringify(ans));
  req.end();
}

module.exports = uploadIntl;