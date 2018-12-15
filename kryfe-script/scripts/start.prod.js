process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const config = require('../config/client/webpack.prod.debug');
const webpackServerRun = require('../utils/webpackServerRun');
const webpackCompileWrapper = require('../utils/webpackCompileWrapper');

webpackCompileWrapper(webpackServerRun, config);
