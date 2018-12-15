process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const config = require('../config/webpack.analyzer');
const compile = require('../utils/webpackCompile');

compile(config);
