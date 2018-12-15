const errorOverlayMiddleware = require("../utils/errorOverlayMiddleware");
const noopServiceWorkerMiddleware = require("../utils/noopServiceWorkerMiddleware");
const config = require("./webpack.common");
const paths = require("./paths");

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "0.0.0.0";

module.exports = function(proxy, allowedHost) {
  return {
    disableHostCheck: !proxy,
    compress: true,
    clientLogLevel: "none",
    contentBase: paths.dist,
    watchContentBase: true,
    hot: true,
    publicPath: config.output.publicPath, //用户在应用访问时的虚拟路径，会被映射为config.output.path路径。
    quiet: true,
    https: protocol === "https",
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true
    },
    public: allowedHost,
    proxy,
    setup(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    }
  };
};
