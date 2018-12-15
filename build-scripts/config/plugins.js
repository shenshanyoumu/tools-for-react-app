const os = require("os");
const webpack = require("webpack");
const OfflinePlugin = require("offline-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const HappyPack = require("happypack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

// 根据构建的宿主机器CPU核数来确定启动的线程数
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 将项目中配置的环境变量进行转换
const __DEV__ = process.env.NODE_ENV === "development";
const __PROD__ = process.env.NODE_ENV === "production";
const __TEST__ = process.env.NODE_ENV === "test";
const __SERVER__ = process.env.BABEL_ENV === "server";
const __CLIENT__ = !__SERVER__;
const __HOST__ = process.env.HOST;
const __PORT__ = process.env.PORT;
const __HOST_API__ = process.env.HOST_API;
const __HOST_CDN__ = process.env.HOST_CDN;

// 从第三方模块的所有chunk文件抽取样式
const extractLibStyle = new ExtractTextPlugin({
  filename: "css/vendor.[contenthash:6].css",
  allChunks: true
});

// 从开发项目所有chunk文件抽取样式
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

  // 定义一系列全局变量
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    __DEV__: JSON.stringify(__DEV__),
    __PROD__: JSON.stringify(__PROD__),
    __TEST__: JSON.stringify(__TEST__),
    __CLIENT__: JSON.stringify(__CLIENT__),
    __SERVER__: JSON.stringify(__SERVER__),
    __HOST__: JSON.stringify(__HOST__),
    __PORT__: JSON.stringify(__PORT__),
    __HOST_API__: JSON.stringify(__HOST_API__),
    __HOST_CDN__: JSON.stringify(__HOST_CDN__)
  }),

  // 将下面三类特性简化替代从而减少lodash打包大小
  new LodashModuleReplacementPlugin({
    cloning: true,
    caching: true,
    paths: true
  })
];

const miniPluginList = [].concat([
  // 从下面几个入口提取公共chunk
  new CommonsChunkPlugin({
    names: ["vendor", "polyfill", "manifest"],
    filename: "js/[name].[hash:6].js"
  }),
  new ModuleConcatenationPlugin(),

  // 忽略有关moment和locale相关插件
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  //对每个chunk计算哈希
  new WebpackChunkHash(),
  new ChunkManifestPlugin({
    inlineManifest: true
  }),
  ...commonPluginList
]);

const pluginList = [].concat(
  new CleanWebpackPlugin(["dist/"], {
    root: process.cwd()
  }),
  ...miniPluginList,

  // 将项目中如下目录内容进行拷贝处理
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

  // 将项目中的ejs模板文件转换为index.html文件；并插入JS/CSS等文件
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "./src/index.ejs",
    minify: {
      removeAttributeQuotes: true
    },
    chunksSortMode: "dependency"
  }),

  // 离线应用插件，注意客户端代码与Service Worker通信，而Service Worker模块与服务端通信
  new OfflinePlugin({
    autoUpdate: 1000 * 60 * 30,
    ServiceWorker: {
      output: "js/sw.js",
      events: true,
      navigateFallbackURL: "/"
    },
    AppCache: false
  })
);

// 根据项目的.babel配置，组件的react-intl形式的语言定义都会被抽取存储在/intl/messages目录下
// 因此每次编译打包都需要清理该目录
const intlPluginList = [].concat(
  new CleanWebpackPlugin(["intl/"], {
    root: process.cwd()
  }),
  ...miniPluginList
);

const serverPluginList = [].concat(...commonPluginList);

module.exports = {
  pluginList,
  intlPluginList,
  serverPluginList,
  extractLibStyle,
  extractProjectStyle
};
