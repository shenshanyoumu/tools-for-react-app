#!/usr/bin/env node
const spawn = require("cross-spawn");

// 在实际项目的package.json文件的scripts字段基于暴露的script-executor命令
// 因为默认第一个参数为node，因此从process.argv第三个参数开始才是真正的参数
const args = process.argv.slice(2);
const supportedScripts = [
  "start",
  "start.prod",
  "build.server",
  "build.client.debug",
  "build.client",
  "analyzer",
  "intl",
  "test"
];
const script = args[0];
const nodeArgs = []
  .concat(require.resolve("../build-scripts/scripts/" + script))
  .concat(args.slice(1));

if (supportedScripts.includes(script)) {
  const result = spawn.sync("node", nodeArgs, { stdio: "inherit" });
  if (result.signal) {
    if (result.signal === "SIGKILL" || result.signal === "SIGTERM") {
      console.warn("process exit by some reason.");
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.error(
    `only the following scripts supported: ${supportedScripts.join(",")}.`
  );
}
