process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const config = require('../config/client/webpack.dev');
const webpackServerRun = require('../utils/webpackServerRun');
const webpackCompileWrapper = require('../utils/webpackCompileWrapper');

webpackCompileWrapper(webpackServerRun, config);
