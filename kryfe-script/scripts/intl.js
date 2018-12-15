process.env.BABEL_ENV = 'intl';
process.env.NODE_ENV = 'production';

const config = require('../config/webpack.intl');
const compile = require('../utils/webpackCompile');
const translateIntl = require('../utils/translateIntl');
const webpackCompileWrapper = require('../utils/webpackCompileWrapper');

webpackCompileWrapper(compile, config).then(() => {
  translateIntl();
});
