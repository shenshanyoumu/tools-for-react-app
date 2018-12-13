const os = require("os");
const webpack = require("webpack");
const OfflinePlugin = require("offline-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const HappyPack = require("happypack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const extractLibStyle = new ExtractTextPlugin({
  filename: "css/vendor.[contenthash:6].css",
  allChunks: true
});
const extractProjectStyle = new ExtractTextPlugin({
  filename: "css/[name].[contenthash:6].css",
  allChunks: true
});

const commonPluginList = [
  extractLibStyle,
  extractProjectStyle,
  new HappyPack({
    id: "js",
    threadPool: happyThreadPool,
    loaders: [`babel-loader?cacheDirectory=${process.env.BABEL_ENV !== "intl"}`]
  }),
  new HappyPack({
    id: "less",
    threadPool: happyThreadPool,
    loaders: [`less-loader`]
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new LodashModuleReplacementPlugin({
    cloning: true,
    caching: true,
    paths: true
  })
];

const miniPluginList = [
  ...commonPluginList,
  new CommonsChunkPlugin({
    names: ["vendor", "polyfill", "manifest"],
    filename: "js/[name].[hash:6].js"
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new WebpackChunkHash(),
  new ChunkManifestPlugin({
    inlineManifest: true
  }),
  new webpack.DefinePlugin({
    __CLIENT__: JSON.stringify(true),
    __SERVER__: JSON.stringify(false)
  })
];

const pluginList = [
  ...miniPluginList,
  new CleanWebpackPlugin(["dist/"], {
    root: process.cwd()
  }),
  new CopyWebpackPlugin([
    {
      from: "./src/assets/images",
      to: "./images"
    },
    {
      from: "./public",
      to: "./"
    },
    {
      from: "./server",
      to: "./"
    },
    {
      from: "./package.json",
      to: "./"
    }
  ]),
  new webpack.NormalModuleReplacementPlugin(
    /Bundles.jsx/,
    "./AsyncBundles.jsx"
  ),
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "./src/index.ejs",
    minify: {
      removeAttributeQuotes: true
    },
    chunksSortMode: "dependency"
  }),
  new OfflinePlugin({
    autoUpdate: 1000 * 60 * 30,
    ServiceWorker: {
      output: "js/sw.js",
      events: true,
      navigateFallbackURL: "/"
    },
    AppCache: false
  })
];

const intlPluginList = [
  ...miniPluginList,
  new CleanWebpackPlugin(["intl/"], {
    root: process.cwd()
  })
];

const serverPluginList = [
  ...commonPluginList,
  new webpack.DefinePlugin({
    __CLIENT__: JSON.stringify(false),
    __SERVER__: JSON.stringify(true)
  })
];

module.exports = {
  pluginList,
  intlPluginList,
  serverPluginList,
  extractLibStyle,
  extractProjectStyle
};
