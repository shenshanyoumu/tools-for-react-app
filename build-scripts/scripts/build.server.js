process.env.BABEL_ENV = "server";
process.env.NODE_ENV = "production";

const config = require("../config/webpack.server");
const compile = require("../utils/webpackCompile");
const webpackCompileWrapper = require("../utils/webpackCompileWrapper");

webpackCompileWrapper(compile, config);
