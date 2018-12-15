process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const config = require('../config/client/webpack.prod.debug');
const compile = require('../utils/webpackCompile');
const webpackCompileWrapper = require('../utils/webpackCompileWrapper');

webpackCompileWrapper(compile, config);
