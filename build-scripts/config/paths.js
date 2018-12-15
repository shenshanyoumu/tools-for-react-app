const path = require("path");
const fs = require("fs");
const url = require("url");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith("/");
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");

  return ensureSlash(servedUrl, true);
}

// 项目中资源路径
module.exports = {
  dist: resolveApp("dist"),
  public: resolveApp("public"),
  appHtml: resolveApp("src/index.ejs"),
  appIndexJs: resolveApp("src/index.jsx"),
  packageJson: resolveApp("package.json"),
  src: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  test: resolveApp("test"),
  nodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json"))
};
