process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("./clearConsole");
const checkRequiredFiles = require("./checkRequiredFiles");
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require("./webpackDevServerUtils");
const openBrowser = require("./openBrowser");
const paths = require("../config/paths");
const createDevServerConfig = require("../config/webpackDevServer");

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
module.exports = function webpackServerRun(config) {
  if (!checkRequiredFiles(paths.appHtml, paths.appIndexJs)) {
    console.log(chalk.red("required the fellowing files: index.html."));
    process.exit(1);
  }

  choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        return;
      }

      const protocol = process.env.HTTPS === "true" ? "https" : "http";
      const appName = require(paths.packageJson).name;
      const urls = prepareUrls(protocol, HOST, port);
      // Load proxy config
      const proxySetting = require(paths.packageJson).proxy;
      const proxyConfig = prepareProxy(proxySetting, paths.dist);
      const options = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);

      WebpackDevServer.addDevServerEntrypoints(config, options);
      const compiler = createCompiler(webpack, config, appName, urls, useYarn);
      const server = new WebpackDevServer(compiler, options);

      server.listen(port, HOST, err => {
        if (err) {
          return console.log(err);
        }
        if (isInteractive) {
          clearConsole();
        }
        console.log(chalk.cyan("Starting the development server...\n"));
        openBrowser(urls.localUrlForBrowser);
      });

      ["SIGINT", "SIGTERM"].forEach(function(sig) {
        process.on(sig, () => {
          server.close();
          process.exit();
        });
      });
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });
};
