const path = require('path');

function parseArgs(args) {
  const ret = {};

  args.forEach((val, index) => {
    if (val.indexOf('--') !== -1) {
      switch (val) {
        case '--config':
          const configPath = path.join(process.cwd(), args[index + 1]);
          ret['customConfig'] = require(configPath);
          break;
      }
    }
  });

  return ret;
}

module.exports = parseArgs;
