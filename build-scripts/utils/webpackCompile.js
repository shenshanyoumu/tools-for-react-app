process.on("unhandledRejection", e => {
  throw e;
});

const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const webpack = require("webpack");
const paths = require("../config/paths");
const checkRequiredFiles = require("./checkRequiredFiles");
const fileSizeHelper = require("./fileSizeHelper");
const printBuildError = require("./printBuildError");

const getFileSize = fileSizeHelper.getFileSize;
const printFileSize = fileSizeHelper.printFileSize;

const MAX_BUNDLE_GZIP_SIZE = 512 * 1024;
const MAX_CHUNK_GZIP_SIZE = 1024 * 1024;

function compile(config, previousfileSize) {
  // Webpack编译器实例对象
  let compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const { errors, warnings } = stats.toJson({}, true);
      if (errors.length) {
        errors.length = 1;
        return reject(new Error(errors.join("\n\n")));
      }

      return resolve({
        stats,
        previousfileSize,
        warnings
      });
    });
  });
}

module.exports = function webpackCompile(config) {
  if (!checkRequiredFiles(paths.appHtml, paths.appIndexJs)) {
    console.log(chalk.red("required the fellowing files: index.htm."));
    process.exit(1);
  }

  return getFileSize(paths.dist)
    .then(fileSize => {
      return compile(config, fileSize);
    })
    .then(({ stats, previousfileSize, warnings }) => {
      if (warnings.length) {
        console.log(
          chalk.yellow(`
        Compiled with warnings.
        ${warnings}\n
      `)
        );
      } else {
        console.log(chalk.green("Compiled successfully.\n"));
      }

      printFileSize(
        stats,
        previousfileSize,
        paths.dist,
        MAX_BUNDLE_GZIP_SIZE,
        MAX_CHUNK_GZIP_SIZE
      );
    })
    .catch(err => {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);
      process.exit(1);
    });
};
