process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const config = require('../config/client/webpack.prod');
const compile = require('../utils/webpackCompile');
const webpackCompileWrapper = require('../utils/webpackCompileWrapper');

webpackCompileWrapper(compile, config);
