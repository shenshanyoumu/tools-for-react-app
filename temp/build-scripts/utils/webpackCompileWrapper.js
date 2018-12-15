const Merge = require('webpack-merge');
const parseArgs = require('./webpackCompileParseArgs');

module.exports = function webpackCompileWrapper(compile, config) {
  const ret = parseArgs(process.argv.slice(2));

  let newConfig = config;

  if (ret.customConfig) {
    newConfig = Merge({
      customizeArray(a, b, key) {
        if (key === 'module.rules' && b[0].type === 'override') {
          b.shift();
          return b;
        }

        return undefined;
      }
    })(config, ret.customConfig);
  }

  return compile(newConfig);
}
